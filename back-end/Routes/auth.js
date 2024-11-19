const express = require('express');
const { signupSession, loginSession ,AreIamAuthenticated,logout } = require('../db/Controlers/authController');
const { verification,ReVertaction,forgetname,reset_password } = require('../db/Controlers/vertactionController'); // Adjusted file extension from .mjs to .js
console.log(signupSession, loginSession ,AreIamAuthenticated,logout )
const router = express.Router();

router.post('/signup', signupSession);
router.post('/login', loginSession);
router.post('/AreIamAuthenticated', AreIamAuthenticated);
router.post('/logout', logout);
router.post('/verification/:type', verification);
router.post('/ReVertaction', ReVertaction);
router.post('/forgetname', forgetname);
router.post('/reset_password', reset_password);

module.exports = router;