const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

const connect = async () => {
    if (process.env.API_URL) return; // Skip if testing live server
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
};

const closeDatabase = async () => {
    if (process.env.API_URL) return; // Skip if testing live server
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongod) {
        await mongod.stop();
    }
};

const clearDatabase = async () => {
    if (process.env.API_URL) return; // Skip if testing live server
    if (mongoose.connection.readyState === 0) return;
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

module.exports = { connect, closeDatabase, clearDatabase };
