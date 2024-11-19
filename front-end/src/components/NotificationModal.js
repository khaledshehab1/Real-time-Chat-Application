import React from "react";

function NotificationModal({ closeNotification }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="bg-white w-full md:w-1/2 lg:w-1/3 rounded-lg p-6 shadow-lg relative">
        <button
          onClick={closeNotification}
          className="absolute top-2 right-4 text-3xl text-gray-700 hover:text-red-500 transition duration-300"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Notifications
        </h2>
        <div>
          {/* محتوى الإشعارات هنا */}
          <p className="text-lg text-center">No new notifications!</p>
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
