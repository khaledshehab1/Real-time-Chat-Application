

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookie = require('cookie');
const { validate } = require('deep-email-validator');
const nodemailer = require('nodemailer');
dotenv.config();
const { MongoClient } = require('mongodb');

const mongodb = new MongoClient(process.env.DB_URL);

let passwords, ipAttempts, verify_emails, cookies, users, try_to_reset;

(async () => {
    await mongodb.connect();

    passwords = mongodb.db('teepublic_db').collection('passwords');
    ipAttempts = mongodb.db('teepublic_db').collection('Login_attempts');

    verify_emails = mongodb.db('teepublic_db').collection('verify_emails');

    cookies = mongodb.db('teepublic_db').collection('cookies');

    users = mongodb.db('teepublic_db').collection('users');
    try_to_reset = mongodb.db('teepublic_db').collection('try_to_reset');

    console.log('MongoDB collections initialized and indexes created.');

})();

function update(req,res)
{
                          





}
exports.module=update;