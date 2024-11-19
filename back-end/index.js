const express = require("express");
const db = require("mongoose");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./Routes/Room.route");
const NotifyRouter = require("./Routes/Notification.route.js");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/auth.js");
const { MongoClient } = require("mongodb");
const rdb = require("../back-end/db/db.js");
const Room = require("./db/Models/Room.model.js");
const RoomModel = require("./db/Models/Room.model.js");
const NotificationModel = require("./db/Models/notification.model.js");
const notifyModel = require("./db/Models/notification.model.js");
const { log } = require("console");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your client URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// MongoDB connection
const mongodb = new MongoClient(process.env.DB_URL);

let passwords, ipAttempts, verify_emails, cookies, users, try_to_reset;

(async () => {
  await mongodb.connect();

  const db = mongodb.db("ChatApp");
  passwords = db.collection("passwords");
  ipAttempts = db.collection("Login_attempts");
  verify_emails = db.collection("verify_emails");
  cookies = db.collection("cookies");
  users = db.collection("users");
  try_to_reset = db.collection("try_to_reset");

  console.log("MongoDB collections initialized and indexes created.");
})();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/rooms", router);
app.use("/notify", NotifyRouter);

// Serve React app
// const buildPath = path.join(__dirname, 'front-end', 'build');
// app.use(express.static(buildPath));

// Fallback to index.html for any other routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(buildPath, 'index.html'));
// });

// Error handling middleware
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}

app.use(errorHandler);

// Socket.IO setup
io.on("connect", (socket) => {
  socket.on("connection", () => {
    console.log("someone is connected");
  });

  socket.on("join", async ({ roomid, email, callback }) => {
    console.log("someone is joined");
    try {
      console.log(roomid);
      console.log(email);
      const room = await Room.findById(roomid);
      console.log(room);
      if (room) {
        if (room.users.includes(email)) {
          console.log("user name is used");
        } else {
          socket.join(room);
          room.users.push(email);
          room.save();
        }
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      callback();
    }
  });

  socket.on("lets send", () => {
    console.log("deal");
  });

  socket.on("send", async ({ text, sender, roomid }) => {
    try {
      const room = await RoomModel.findById(roomid);
      room.messages.push({ message: text, sender: sender });
      room.save();
      socket.emit("message", { message: { text, sender }, change: Date.now() });
      socket.broadcast.emit("update", { text: text, sender: sender });
      console.log("message done");

      socket.on("notify", async ({ roomname, roomid, text, sender }) => {
        try {
          // Create a new notification document
          const notification = new notifyModel({
            Room: roomname,
            messages: text,
            sender: sender,
            isRead: false,
          });

          // Save the notification to the database
          await notification.save();
          console.log("note done");

          console.log("Notification saved:", notification);
        } catch (error) {
          console.error("Error saving notification:", error);
        }
      });
    } catch (error) {}
  });
  socket.on("deleteNote", async ({ id }) => {
    await notifyModel.findByIdAndDelete(id);

    console.log("delete done");
  });
});

// Start the server
const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  rdb.ConnectDB();
  console.log(`App is running on port ${PORT}`);
});
