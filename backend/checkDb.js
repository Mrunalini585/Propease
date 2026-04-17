const mongoose = require('mongoose');

mongoose.connect('mongodb:mongodb://localhost:27017/propease').then(async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    for (let c of collections) {
        const count = await db.collection(c.name).countDocuments();
        console.log(`${c.name}: ${count}`);
    }
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
