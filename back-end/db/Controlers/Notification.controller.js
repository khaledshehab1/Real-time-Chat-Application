const express = require("express");
const notifyModel = require("../Models/notification.model");

const app = express();

exports.getAllNotifications = async (req, res) => {
  try {
    const notification = await notifyModel.find();
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notifyModel.findById(id);

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.log(error);
  }
};

exports.AddNotification = async (req, res) => {
  const notification = req.body;
  if (!notification.message) {
    res.status(400).json({ success: false, message: "error in posting" });
  }

  const newNotify = new notifyModel(newNotify);

  try {
    await newNotify.save().then(() => {
      console.log("Notification added successfully");
      res.status(201).json({ success: true, data: newNotify });
    });
  } catch (error) {
    console.log("Error in creating product:", error.message);
  }
};



exports.deleteNotificition = async (req, res) => {
  const { id } = req.params;
  try {
    await notifyModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Room not found" });
    console.log("error");
  }
};