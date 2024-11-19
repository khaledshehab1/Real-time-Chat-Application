const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookie = require("cookie");
const { validate } = require("deep-email-validator");
const nodemailer = require("nodemailer");
dotenv.config();
const { MongoClient } = require("mongodb");

function Check_differance(timestamp) {
  // Check if the difference between now and the token's timestamp is more than 21 days
  const twentyOneDaysInMilliseconds = 60 * 60 * 1000;
  return Date.now() - timestamp > twentyOneDaysInMilliseconds;
}

const mongodb = new MongoClient(process.env.DB_URL);

let passwords, ipAttempts, verify_emails, cookies, users, try_to_reset;

(async () => {
  await mongodb.connect();

  // Initialize collections properly
  const db = mongodb.db("ChatApp");
  passwords = db.collection("passwords");
  ipAttempts = db.collection("Login_attempts");
  await ipAttempts.createIndex({ createdAt: 1 }, { expireAfterSeconds: 600 }); // Documents expire after 10 minutes

  verify_emails = db.collection("verify_emails");
  await verify_emails.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3 * 60 }
  ); // Documents expire after 3 minutes

  cookies = db.collection("cookies");
  await cookies.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 16 * 24 * 60 * 60 }
  ); // Documents expire after 16 days

  users = db.collection("users");
  try_to_reset = db.collection("try_to_reset");
  await try_to_reset.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3 * 60 * 60 }
  ); // Documents expire after 3 hours

  console.log("MongoDB collections initialized and indexes created.");
})();
console.log("password", passwords);
console.log(process.env.SESSIONS_SECRET_KEY);
const validatePassword = (password) => {
  const lengthCheck = password.length >= 8 && password.length <= 128;
  const numberCheck = /[0-9]/.test(password);
  const upperCheck = /[A-Z]/.test(password);
  const lowerCheck = /[a-z]/.test(password);
  const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!lengthCheck) return "Password must be between 8-128 characters.";
  if (!numberCheck) return "Password must include at least one number.";
  if (!upperCheck)
    return "Password must include at least one uppercase letter.";
  if (!lowerCheck)
    return "Password must include at least one lowercase letter.";
  if (!specialCheck)
    return "Password must include at least one special character.";

  return ""; // No errors
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// MongoDB setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

console.log(process.env.email);
console.log(process.env.SESSIONS_SECRET_KEY);

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SESSIONS_SECRET_KEY, {
    expiresIn: "21d",
  });
};

const sendemail = (email, num) => {
  const mailOptions = {
    from: process.env.email,
    to: email,
    subject: "Verify Your Email for Chat App",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hi,</h2>
        <p>Thank you for signing up with Chat APP! To complete your registration, we just need to verify your email address.</p>
        <p>Please use the verification code below to verify your email:</p>
        <p style="font-size: 24px; font-weight: bold; color: #333;">Your Verification Code: <span style="font-size: 32px; color: #d9534f;">${num}</span></p>
        <p style="color: #555;">This code will expire in <strong>60 seconds</strong>, so make sure to enter it quickly.</p>
        <p>If you didn’t sign up for an account, please ignore this email.</p>
        <br>
        <p>Thanks,<br>The Ninja Team</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// User signup
exports.signupSession = async (req, res) => {
  const { name, email, password } = req.body;
  var email_Validation = await validate({ email: email, validateSMTP: false });
  console.log(email_Validation.valid, email_Validation, email);

  if (validatePassword(password) !== "") {
    res.json({
      success: false,
      title: "Sign up failed",
      message: "Please enter valid email",
      showError: true,
      auth: false,
    });
    return;
  }

  if (validatePassword(password) !== "") {
    res.json({
      success: false,
      title: "Sign up failed",
      message: "Please enter stronger password and meet our requirements",
      showError: true,
      auth: false,
    });
    return;
  }

  const info = await passwords.findOne({ email });
  if (info && info.verify) {
    res.json({
      success: false,
      title: "Sign up failed",
      message: "Email already exists",
      showError: true,
      auth: false,
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the passwords collection
    await passwords.updateOne(
      { email: email }, // Query to find the document by email
      {
        $set: {
          password: hashedPassword, // Update password field
          name: name, // Update name field
          verify: false, // Update verify field
        },
      },
      { upsert: true } // Insert if the document doesn't exist
    );

    // Fetch the password document to get the _id (since updateOne doesn't return the updated document)
    const pass_info = await passwords.findOne({ email: email });

    if (!pass_info) {
      throw new Error("Password document not found.");
    }

    var num = getRndInteger(100000, 999999);

    // Update verify_emails collection
    await verify_emails.updateOne(
      { email: email }, // Query to find the document
      {
        $set: { num: num, count: 0 }, // Always update 'num' and 'count'
        $setOnInsert: { global_retries: 0 }, // Set 'global_retries' to 0 only on insert
      },
      { upsert: true } // Insert if the document doesn't exist
    );

    // Update the users collection with the _id from passwords collection
    await users.updateOne(
      { email: email }, // Query to find the user by email
      {
        $set: {
          _id: pass_info._id, // Set the _id of the user to the _id from passwords collection
          rooms: [], // Initialize rooms array
        },
      },
      { upsert: true } // Insert if the document doesn't exist
    );

    console.log("Password, verification, and user updated successfully");

    await sendemail(email, num);
    res.json({
      success: true,
      message: "Signup success",
      showError: false,
      auth: true,
      email: email,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        success: false,
        message: "Signup failed",
        error: err.message,
        showError: true,
        auth: false,
      });
  }
};

exports.loginSession = async (req, res) => {
  console.log("Login");
  const { email, password } = req.body;
  const userIP =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Get the user's IP address

  // Validate email format
  var email_Validation = await validate({ email: email, validateSMTP: false });
  if (email && !email_Validation.valid) {
    return res.json({
      success: false,
      title: "Login failed",
      message: "Please enter a valid email",
      showError: true,
      auth: false,
    });
  }

  // Fetch user info by email
  const info = await passwords.findOne({ email });
  if (!info) {
    return res.status(401).json({
      success: false,
      title: "Login failed",
      message: "Email doesn't exist",
      showError: true,
      auth: false,
    });
  }

  // Check if the email is verified
  if (!info.verify) {
    var result = await verify_emails.findOne({ email: email });
    if (!result) {
      const num = getRndInteger(100000, 999999);
      await verify_emails.updateOne(
        { email: email }, // Query to find the document
        {
          $set: { num: num, count: 0 }, // Always update 'num' and reset 'count'
          $setOnInsert: { global_retries: 0 }, // Set 'global_retries' only on insert
        },
        { upsert: true } // Insert if the document doesn't exist
      );
      await sendemail(email, num);
    }
    return res.json({ verify: true });
  }

  // Check IP attempts from the new collection
  var ipRecord = await ipAttempts.findOne({ ip: userIP });
  if (!ipRecord) {
    ipRecord = await ipAttempts.insertOne({
      email: email,
      ip: userIP,
      failedAttempts: 0,
      createdAt: new Date(), // Add createdAt field for TTL
    });
  }

  console.log(ipRecord);
  try {
    // Ensure ipRecord has a valid failedAttempts count (default to 0 if undefined)
    const failedAttempts = ipRecord ? ipRecord.failedAttempts : 0;

    if (!failedAttempts || failedAttempts < 10) {
      const isPasswordValid = await bcrypt.compare(password, info.password);

      if (isPasswordValid) {
        // If login is successful, delete the failed attempts record for this IP
        await ipAttempts.deleteOne({ email, ip: userIP });

        const tokenPayload = {
          email: info.email,
          id: info._id,
          rule: info.rule,
          name: info.name,
          date: Date.now(),
        };

        const token = generateToken(tokenPayload);

        // Set the JWT cookie
        res.cookie("jwtToken", token, {
          secure: false, // Use true in production with HTTPS
          httpOnly: true, // Prevent client-side access
          path: "/", // Cookie will be accessible for all paths
          maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
        });

        return res.json({
          success: true,
          email: info.email,
          name: info.name,
          message: "Login successful",
          token: token,
          auth: true,
        });
      } else {
        // Handle failed password attempts
        const newFailedAttempts = failedAttempts + 1;

        // Check if the user has failed 10 times from this IP and ban them for 10 minutes
        if (newFailedAttempts >= 10) {
          await ipAttempts.updateOne(
            { email: email, ip: userIP },
            {
              $set: {
                failedAttempts: newFailedAttempts,
                createdAt: new Date(),
              },
            }
          );
          return res.json({
            success: false,
            title: "Login failed",
            message: "Too many failed attempts. Try again later.",
            showError: true,
            auth: false,
          });
        } else {
          await ipAttempts.updateOne(
            { email: email, ip: userIP },
            { $set: { failedAttempts: newFailedAttempts } }
          );
        }

        return res.json({
          success: false,
          title: "Login failed",
          message: "Incorrect password",
          showError: true,
          auth: false,
        });
      }
    } else {
      return res.json({
        success: false,
        title: "Login failed",
        message: "Too many failed attempts. Try again later.",
        showError: true,
        auth: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      title: "Error",
      message: "Internal Server Error",
      showError: true,
      auth: false,
    });
  }
};

// User logout

exports.AreIamAuthenticated = (req, res) => {
  try {
    // Verify JWT token
    console.log(req.cookies);
    const token = req.cookies["jwtToken"];

    if (!token) {
      // No token present
      console.log("No token found");
      return res.json({ auth: false });
    }

    jwt.verify(token, process.env.SESSIONS_SECRET_KEY, (err, payload) => {
      if (err) {
        // Invalid token or verification error
        console.log("Token verification failed:", err);
        return res.json({ auth: false });
      }

      // Check if the token's payload is older than 21 days
      if (Check_differance(payload.data)) {
        console.log("Token has expired");
        return res.json({ auth: false });
      }

      // If token is valid and not expired, user is authenticated
      console.log("User is authenticated");
      return res.json({ auth: true, email: payload.email, name: payload.name });
    });
  } catch (err) {
    console.error("Authentication error:", err);
    return res.json({ auth: false });
  }
};
exports.logout = (req, res) => {
  // Clear the JWT token cookie by setting it to an empty value with an expired date
  res.clearCookie("jwtToken", {
    path: "/", // Make sure the cookie path matches where it was set
    httpOnly: true, // Prevent client-side access
    secure: false, // Use true for production with HTTPS
    sameSite: "Lax", // Control cross-origin behavior
  });

  // Respond with success message
  res.json({ success: true, message: "Logged out successfully" });
};
