const jwt =require( 'jsonwebtoken');
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
// Function to check if the token's timestamp is older than 21 days
function CheckDifference(timestamp) {
  const twentyOneDaysInMilliseconds = 21 * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp > twentyOneDaysInMilliseconds;
}

exports. AuthMiddleware = async(req, res, next)=> {
  try {
    // Retrieve the token from cookies
    const token = req.cookies["jwtToken"];
    
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ auth: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.SESSIONS_SECRET_KEY, (err, payload) => {
      if (err) {
        console.log("Token verification failed:", err);
        return res.status(401).json({ auth: false, message: "Invalid or expired token" });
      }
      console.log()
console.log(payload)
      // Check if the token's payload contains a valid timestamp and if it's older than 21 days
      if (!payload.date ||payload.exp>Date.now()) {
        console.log("Token has expired or timestamp missing");
        return res.status(401).json({ auth: false, message: "Token expired" });
      }

      // Token is valid and within the allowed time frame
      console.log("User is authenticated");
      req.user = payload;
      
      next();
    });
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({ auth: false, message: "Internal server error" });
  }
}

