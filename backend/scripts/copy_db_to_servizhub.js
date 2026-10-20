const mongoose = require("mongoose");

const sourceUri = "mongodb+srv://muthukumar_9360:Muthukumar%409360@cluster0.uzsaneo.mongodb.net/servizio?retryWrites=true&w=majority&appName=Cluster0";
const targetUri = "mongodb+srv://muthukumar_9360:Muthukumar%409360@cluster0.uzsaneo.mongodb.net/servizhub?retryWrites=true&w=majority&appName=Cluster0";

async function cloneDatabase() {
  console.log("Connecting to source database (servizio)...");
  const sourceConn = await mongoose.createConnection(sourceUri).asPromise();
  console.log("✅ Connected to source (servizio)");

  console.log("Connecting to target database (servizhub)...");
  const targetConn = await mongoose.createConnection(targetUri).asPromise();
  console.log("✅ Connected to target (servizhub)");

  const collections = await sourceConn.db.listCollections().toArray();
  console.log(`Found ${collections.length} collections in servizio to copy:`, collections.map(c => c.name));

  for (const collInfo of collections) {
    const collName = collInfo.name;
    if (collName.startsWith("system.")) continue;

    console.log(`Copying collection: ${collName}...`);
    const sourceColl = sourceConn.db.collection(collName);
    const targetColl = targetConn.db.collection(collName);

    const docs = await sourceColl.find({}).toArray();
    if (docs.length > 0) {
      // Clear target collection first to avoid duplicates
      await targetColl.deleteMany({});
      await targetColl.insertMany(docs);
      console.log(`  -> Copied ${docs.length} documents into servizhub.${collName}`);
    } else {
      console.log(`  -> 0 documents in ${collName}, creating empty collection.`);
      await targetConn.db.createCollection(collName).catch(() => {});
    }
  }

  console.log("\n🎉 Database clone complete! All collections & data successfully copied to 'servizhub'.");
  await sourceConn.close();
  await targetConn.close();
  process.exit(0);
}

cloneDatabase().catch((err) => {
  console.error("❌ Error cloning database:", err);
  process.exit(1);
});
