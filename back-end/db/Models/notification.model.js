const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema({
  Room: {
    type: String,
    required: true,
  },

  messages: {
    type: String,
    require: true,
  },

  sender: {
    type: String,
    require: true,
  },
  isRead:
  {
    type:Boolean,
    require:true
  }
});

const notifyModel = mongoose.model("Notification", notifySchema);

module.exports = notifyModel;