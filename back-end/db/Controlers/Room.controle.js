const express = require("express");
const RoomModel = require("../Models/Room.model");

const app = express();

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomModel.find();
    return res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await RoomModel.findById(id);

    res.status(200).json({ success: true, data: room });
  } catch (error) {
    console.log(error);
  }
};

exports.AddRoom = async (req, res) => {
  const room = req.params;
  if (!room.name) {
    res.status(400).json({ success: false, message: "error in posting" });
  }

  const newRoom = new RoomModel(room);

  try {
    await newRoom.save().then(() => {
      console.log("room added successfully");
      res.status(201).json({ success: true, data: newRoom });
    });
  } catch (error) {
    console.log("Error in creating product:", error.message);
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id, user } = req.params;

    // Find the room by id
    const room = await RoomModel.findById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Add the new user(s) to the users array
    room.users.push(user);

    // Save the updated room
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await RoomModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Room not found" });
    console.log("error");
  }
};
