// NotificationItem.js
const NotificationItem = ({ sender, text, roomName, onMarkAsRead }) => {
  return (
    <div className="notification-item p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-lg">{sender}</h4>
        <span className="text-sm text-gray-500">{roomName}</span>
      </div>
      <p className="text-gray-700 mt-2">{text}</p>
      <button
        className="mt-4 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
        onClick={onMarkAsRead} // Call function to mark as read
      >
        Mark as Read
      </button>
    </div>
  );
};

export default NotificationItem;
