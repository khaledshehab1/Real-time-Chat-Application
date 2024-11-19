import { useState, useEffect , useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Personel_context } from "../states/contexs";
function Profile() {
  const [name, setName] = useState("Khaled Shehab");
  const [introduction, setIntroduction] = useState("I am React Web Developer");
  const [image, setImage] = useState("path_to_profile_image");


  // Load saved data from localStorage when the component mounts
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedIntroduction = localStorage.getItem("introduction");
    const savedImage = localStorage.getItem("image");

    if (savedName) setName(savedName);
    if (savedIntroduction) setIntroduction(savedIntroduction);
    if (savedImage) setImage(savedImage);
  }, []);

  const handleNameChange = (e) => setName(e.target.value);
  const handleIntroductionChange = (e) => setIntroduction(e.target.value);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Save data to localStorage
    localStorage.setItem("name", name);
    localStorage.setItem("introduction", introduction);
    localStorage.setItem("image", image);
    alert("Profile saved successfully!");
  };

  const navigateFun = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-900 to-black">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Edit Your Profile
        </h1>

        <div className="w-32 h-32 mx-auto mb-4">
          <img
            src={image}
            alt="profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Hidden input and custom button for file upload */}
        <label className="block mb-4 text-center">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-900 transition-all duration-200"
          >
            Change Photo
          </button>
        </label>

        <label className="block mb-2">
          <span className="text-gray-700 font-bold">Name:</span>
          <input
            type="text"
            className="block w-full mt-1 p-2 border-black-300 rounded bg-gray-200"
            value={name}
            onChange={handleNameChange}
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700 font-bold">Introduction:</span>
          <input
            type="text"
            className="block w-full mt-1 p-2 border-gray-300 rounded bg-gray-200"
            value={introduction}
            onChange={handleIntroductionChange}
          />
        </label>

        <button
          onClick={handleSave}
          className="mt-4 w-1/2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-900 cursor-pointer transition-all duration-200"
        >
          Save Changes
        </button>
        <button
          onClick={() => navigateFun("/Chat")}
          className="mt-4 w-1/3 ml-16 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-900 cursor-pointer transition-all duration-200"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Profile;
