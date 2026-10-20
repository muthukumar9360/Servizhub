const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const latestFolder = path.join(__dirname, "../backups/latest");

async function restore() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not found in backend/.env");
    process.exit(1);
  }

  if (!fs.existsSync(latestFolder)) {
    console.error(`❌ No backup found at: ${latestFolder}`);
    console.error("Run `node backend/scripts/backup_db.js` first to create a backup!");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas for Restore...");
  await mongoose.connect(uri);
  console.log("Connected successfully!");

  const files = fs.readdirSync(latestFolder).filter((f) => f.endsWith(".json"));
  console.log(`\nRestoring ${files.length} collections from: ${latestFolder}`);

  for (const file of files) {
    const colName = file.replace(".json", "");
    const raw = fs.readFileSync(path.join(latestFolder, file), "utf8");
    const docs = JSON.parse(raw);

    if (docs.length === 0) {
      console.log(` ⏩ ${colName}: Backup is empty, skipping.`);
      continue;
    }

    try {
      await mongoose.connection.collection(colName).drop().catch(() => {});
      await mongoose.connection.collection(colName).insertMany(docs);
      console.log(` ✅ ${colName}: Restored ${docs.length} documents`);
    } catch (err) {
      console.error(` ❌ Error restoring ${colName}:`, err.message);
    }
  }

  console.log("\n🎉 RESTORE COMPLETED SUCCESSFULLY!\n");
  process.exit(0);
}

restore().catch((err) => {
  console.error("❌ Restore failed:", err);
  process.exit(1);
});
