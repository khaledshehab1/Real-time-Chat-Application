const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const mongodb = new MongoClient(process.env.DB_URL);

let passwords, ipAttempts, verify_emails, cookies, users, try_to_reset;

(async () => {
    await mongodb.connect();

    passwords = mongodb.db('teepublic_db').collection('passwords');
    ipAttempts = mongodb.db('teepublic_db').collection('Login_attempts');
    await ipAttempts.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 600 }); // Documents expire after 10 minutes

    verify_emails = mongodb.db('teepublic_db').collection('verify_emails');
    await verify_emails.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3 * 60 }); // Documents expire after 3 minutes

    cookies = mongodb.db('teepublic_db').collection('cookies');
    await cookies.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 16 * 24 * 60 * 60 }); // Documents expire after 16 days

    users = mongodb.db('teepublic_db').collection('users');
    try_to_reset = mongodb.db('teepublic_db').collection('try_to_reset');
    await try_to_reset.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3 * 60 * 60 }); // Documents expire after 3 hours

    // console.log('MongoDB collections initialized and indexes created.');
    // console.log(    passwords,
    // ipAttempts,
    // verify_emails,
    // cookies,
    // users,
    // try_to_reset)
})();

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log('Mongoose connected');
    } catch (error) {
        console.log({ message: `Failed to connect to DB: ${error}` });
        process.exit(1);
    }
};

module.exports = {
    ConnectDB,
    mongodb,
    passwords,
    ipAttempts,
    verify_emails,
    cookies,
    users,
    try_to_reset
};