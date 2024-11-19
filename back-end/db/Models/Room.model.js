const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  messages: {
    type: Array,
    require: true,
  },

  users: {
    type: Array,
    require: true,
  },
});

const RoomModel = mongoose.model('Room', RoomSchema);

module.exports = RoomModel;
