const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const backupDir = path.join(__dirname, "../backups");

async function backup() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not found in backend/.env");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas for Backup...");
  await mongoose.connect(uri);
  console.log("Connected successfully!");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const collections = ["User", "Businesses", "Businesslist", "services", "servicelist", "messages", "guides", "SavedList", "FavouriteList"];
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const currentBackupFolder = path.join(backupDir, `backup_${timestamp}`);
  fs.mkdirSync(currentBackupFolder, { recursive: true });

  console.log(`\nExporting collections to: ${currentBackupFolder}`);

  for (const colName of collections) {
    try {
      const data = await mongoose.connection.db.collection(colName).find({}).toArray();
      const filePath = path.join(currentBackupFolder, `${colName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      console.log(` ✅ ${colName}: Exported ${data.length} documents`);
    } catch (err) {
      console.warn(` ⚠️ Could not export ${colName}:`, err.message);
    }
  }

  // Also save a latest copy
  const latestFolder = path.join(backupDir, "latest");
  if (fs.existsSync(latestFolder)) {
    fs.rmSync(latestFolder, { recursive: true, force: true });
  }
  fs.cpSync(currentBackupFolder, latestFolder, { recursive: true });

  console.log("\n🎉 BACKUP COMPLETED SUCCESSFULLY!");
  console.log(`Latest backup saved to: backend/backups/latest/\n`);
  process.exit(0);
}

backup().catch((err) => {
  console.error("❌ Backup failed:", err);
  process.exit(1);
});
