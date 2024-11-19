
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookie = require('cookie');
const nodemailer = require('nodemailer');
const { validate } = require('deep-email-validator');
const { MongoClient } = require('mongodb');

dotenv.config();

const mongodb = new MongoClient(process.env.DB_URL);

let passwords, ipAttempts, verify_emails, cookies, users, try_to_reset;

(async () => {
    await mongodb.connect();

    // Initialize collections properly
    const db = mongodb.db('ChatApp');
    passwords = db.collection('passwords');
    ipAttempts = db.collection('Login_attempts');
    await ipAttempts.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 600 }); // Documents expire after 10 minutes

    verify_emails = db.collection('verify_emails');
    await verify_emails.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3 * 60 }); // Documents expire after 3 minutes

    cookies = db.collection('cookies');
    await cookies.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 16 * 24 * 60 * 60 }); // Documents expire after 16 days

    users = db.collection('users');
    try_to_reset = db.collection('try_to_reset');
    await try_to_reset.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3 * 60 * 60 }); // Documents expire after 3 hours

    console.log('MongoDB collections initialized and indexes created.');
})();
function Check_differance(timestamp) {
  // Check if the difference between now and the token's timestamp is more than 21 days
  const twentyOneDaysInMilliseconds =  60 * 60 * 1000;
  return Date.now() - timestamp > twentyOneDaysInMilliseconds;
}
const validatePassword = (password) => {
  if (password.length < 8 || password.length > 128) return "Password must be between 8-128 characters.";
  if (!/[0-9]/.test(password)) return "Password must include at least one number.";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must include at least one special character.";
  return "";
};
const generateToken = (payload) => {

  return jwt.sign(payload, process.env.forget_name, { expiresIn: '24h' });
};
dotenv.config();
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
// MongoDB setup

var transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});
const sendemail=(email,num)=>{

var mailOptions = {
  from: process.env.email,
  to: email,
  subject: 'Verify Your Email for Chat App',
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hi,</h2>
      <p>Thank you for signing up with Chat APP! To complete your registration, we just need to verify your email address.</p>
      <p>Please use the verification code below to verify your email:</p>
      <p style="font-size: 24px; font-weight: bold; color: #333;">Your Verification Code: <span style="font-size: 32px; color: #d9534f;">${num}</span></p>
      <p style="color: #555;">This code will expire in <strong>180 seconds</strong>, so make sure to enter it quickly.</p>
      <p>If you didn’t sign up for an account, please ignore this email.</p>
      <br>
      <p>Thanks,<br>The Ninja Team</p>
    </div>
  `
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
}
// Ensure the index is created for documents to expire after 10 minutes

 const verification = async (req, res) => {
    try {
        console.log("verification");
        const { num, email } = req.body;
        const type = req.params['type'];  // Retrieve the type from the URL params

        console.log("Request Type:", type, "Email:", email);

        // Fetch verification info based on email
        const info = await verify_emails.findOne({ email: email });

        if (!info) {
            return res.json({
                success: false,
                title: type === 'signup' ? "Sign Up Failed" : "Password Reset Failed",
                message: 'No verification information found for the provided email.',
                showError: true,
                auth: false
            });
        }

        // Check general verification retry limit
        if (info.count >= 3) {
            return res.json({
                success: false,
                title: type === 'signup' ? "Sign Up Failed" : "Password Reset Failed",
                message: 'You have exceeded the maximum number of verification attempts.',
                showError: true,
                auth: false
            });
        }
        console.log(info,num)

        // Additional check for `forgetpassword` type request - Check retry limit in `try_to_reset`
        if (type !== "signup") {
            const tries = await try_to_reset.findOne({ email: email });

            if (tries && tries.count >= 3) {
                return res.json({
                    success: false,
                    title: "Retry Limit Exceeded",
                    message: "You have exceeded the maximum number of reset attempts. Please try again later.",
                    showError: true,
                    auth: false
                });
            }
        }

        // Check if the provided number matches the one in the database
        if (num != info.num) {
            // Increment the attempt count on wrong number
            await verify_emails.updateOne({ email: email }, { $inc: { count: 1 } });

            return res.json({
                success: false,
                title: type === 'signup' ? "Sign Up Failed" : "Password Reset Failed",
                message: 'Incorrect verification code. Please try again.',
                showError: true,
                auth: false
            });
        }

        // Process the request based on the type
        if (type === 'signup') {
            // Mark the email as verified in the passwords collection for signup
            await passwords.updateOne({ email: email }, { $set: { verify: true } });
    
            return res.json({
                success: true,
                title: "Sign Up Success",
                message: 'Your email has been verified. You can now log in.',
                showError: false,
                auth: true
            });
        } else if (type === 'forgetpassword') {
            // Handle password reset verification case
                const tokenPayload = { email: info.email, data: Date.now() };
                console.log(tokenPayload);
                const token = generateToken(tokenPayload);

                res.cookie('password_reset', token, {
                    secure: false, // Use true in production with HTTPS
                    httpOnly: true, // Prevent client-side access
                    path: '/', // Cookie will be accessible for all paths
                    maxAge: 1*60 * 60 * 1000, // 1 day expiration
                });

            return res.json({
                success: true,
                title: "Verification Successful",
                message: 'Verification successful. You can now reset your password.',
                showError: false,
                auth: true
            });
        } else {
            return res.json({
                success: false,
                title: "Invalid Request",
                message: 'Unknown verification type.',
                showError: true,
                auth: false
            });
        }

    } catch (error) {
        console.error("Error during verification:", error);
        return res.status(500).json({
            success: false,
            title: "Server Error",
            message: 'An error occurred during verification. Please try again later.',
            showError: true,
            auth: false
        });
    }
};

 const ReVertaction = async (req, res) => {
  try {
    console.log("Verification started");
    const { num, email } = req.body;
    console.log("Email:", email);

    // Find the email document in the database
    const info = await verify_emails.findOne({ email: email });

    console.log("Document found:", info);

    // If the document exists and global retries are less than 3
    if (info && info.global_retries < 3) {
      const rand_num = getRndInteger(100000, 999999); // Generate a random number

      // Update the document with the new number and reset the count
      await verify_emails.updateOne(
        { email: email },  // Query to find the document
        {
          $set: { num: rand_num, count: 0 },  // Update 'num' and reset 'count'
          $inc: { global_retries: 1 }  // Increment 'global_retries' by 1
        },
        { upsert: true }  // Insert if the document doesn't exist
      );

      // Send verification email
      await sendemail(email, rand_num);

      // Send response for retry verification
      return res.json({
        success: false,
        title: "Verification sumbit success",
        message: 'Enter the code sent to your email',
        showError: true,
        auth: false
      });

    } else if (info && info.global_retries >= 3) {
      // If the global retries exceed 3
      return res.json({
        success: false,
        title: "Verification Submit Failed",
        message: 'The number of verification tries exceeded. Try again after 3 minutes.',
        showError: true,
        auth: false
      });

    } else {
      // If no email was found
      return res.json({
        success: false,
        title: "No Email Found",
        message: "You're trying to verify an email that doesn't exist.",
        showError: true,
        auth: false
      });
    }

  } catch (error) {
    console.error("Error during verification:", error);

    // Send server error response
    return res.status(500).json({
      success: false,
      title: "Server Error",
      message: 'An error occurred during verification.',
      showError: true,
      auth: false
    });
  }
};

 const forgetname = async (req, res) => {
    var { email } = req.body;
console.log("forgetname",email)
    try {
        // Check if the email exists in the passwords collection
        var info = await passwords.findOne({ email: email });

        // If the email does not exist in the passwords collection
        if (!info) {
            return res.json({
                success: false,
                title: "Email Not Found",
                message: "The provided email is not associated with any account. Please check the email address or sign up.",
                showError: true,
                auth: false
            });
        }

        // Check the number of tries for this email in the try_to_reset collection
        var tries = await try_to_reset.findOne({ email: email });

        // If the retry limit is reached
        if (tries && tries.count >= 3) {
            return res.json({
                success: false,
                title: "Retry Limit Exceeded",
                message: "You have exceeded the maximum number of reset attempts. Please try again later.",
                showError: true,
                auth: false
            });
        }

                if (!tries) {
                    // If no document is found, insert a new one with count = 0
                    await try_to_reset.insertOne({
                        email: email,
                        count: 0
                    });
                } else {
                    // If document exists, increment the count by 1
                    await try_to_reset.updateOne(
                        { email: email },
                        { $inc: { count: 1 } }
                    );
                }

        // Generate a random verification number
        const rand_num = getRndInteger(100000, 999999); // Generate a random number
        // Update the verify_emails collection with the new number and increment retries
        await verify_emails.updateOne(
            { email: email },  // Query to find the document
            {
                $set: { num: rand_num },  // Update 'num' with the new random number
                $inc: { global_retries: 1 }  // Increment 'global_retries' by 1
            },
            { upsert: true }  // Insert if the document doesn't exist
        );

        // Send the verification email
        await sendemail(email, rand_num);

        // Respond with success message
        return res.json({
            success: true,
            title: "Verification Submitted",
            message: 'A verification code has been sent to your email. Please check your inbox.',
            showError: false,
            auth: true
        });

    } catch (error) {
        console.log(error)
        // Handle any unexpected errors
        return res.json({
            success: false,
            title: "Unexpected Error",
            message: "An error occurred while processing your request. Please try again after 3 hours.",
            showError: true,
            auth: false
        });
    }
};
 const reset_password = async (req, res) => {
    const { email, password } = req.body;
    const token = req.cookies["password_reset"]; // Retrieve token from cookies

    try {
        // Verify the JWT token
        const decoded = await jwt.verify(token, process.env.forget_name);
        
        // Check if the decoded email matches the one provided in the request
        if (decoded.email !== email) {
            return res.json({
                success: false,
                title: "Reset Password Failed",
                message: "Authorization mismatch. Please make sure you're authorized to reset this password.",
                showError: true,
                auth: false
            });
        }
        var valid=validatePassword(password)
        if (valid!="")    
        {
                 return res.json({
                success: false,
                title: "Reset Password Failed",
                message: "the password does not meet the requirements",
                showError: true,
                auth: false
            });
                
            }

        // Hash the new password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the password in the database
        await passwords.updateOne({ email: email }, { $set: { password: hashedPassword } });
            res.clearCookie('password_reset', {
                path: '/',        // Make sure the cookie path matches where it was set
                httpOnly: true,   // Prevent client-side access
                secure: false,    // Use true for production with HTTPS
                sameSite: 'Lax',  // Control cross-origin behavior
            });
        // Send success response after successful password update
        return res.json({
            success: true,
            title: "Reset Password Succeeded",
            message: "Password reset successful. You can now log in with your new password.",
            showError: false,
            auth: true
        });

    } catch (error) {
        // Handle errors (JWT verification errors, database errors, etc.)
        if (error.name === "JsonWebTokenError") {
            return res.json({
                success: false,
                title: "Reset Password Failed",
                message: "Invalid or expired token. Please try the password reset process again.",
                showError: true,
                auth: false
            });
        }

        // For any other errors
        console.error("Error during password reset:", error);
        return res.json({
            success: false,
            title: "Unexpected Error",
            message: "An error occurred while processing your request. Please try again later.",
            showError: true,
            auth: false
        });
    }
};

module.exports = { verification, ReVertaction, forgetname, reset_password };
