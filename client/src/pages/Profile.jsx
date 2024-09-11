import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'; // Ensure firebase app is correctly imported

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: '',
    avatar: currentUser?.avatar || '',
  });

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Safely update the formData state with the new avatar URL
          setFormData((prevState) => ({ ...prevState, avatar: downloadURL }));
          setFilePerc(0); // Reset upload progress after completion
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    // Simulate an API call to save user profile, including the avatar URL
    console.log('Update Profile:', formData);

    // Here you would make an API call to save the updated profile to your backend.
    // Example: await api.updateUserProfile(currentUser.id, formData);
  };

  const handleDeleteAccount = () => {
    // Handle delete account logic here
    console.log('Delete Account');
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout');
  };

  useEffect(() => {
    // Fetch current user data on load to ensure data is available after refresh
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        password: '',
        avatar: currentUser.avatar, // Fetch avatar from the backend
      });
    }
  }, [currentUser]);

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Profile
      </h1>
      <input
        onChange={(e) => setFile(e.target.files[0])}
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
      />
      {/* Avatar Image */}
      <div className="flex justify-center mb-6">
        {formData?.avatar ? (
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover cursor-pointer self-center mt-2"
          />
        ) : (
          <img
            onClick={() => fileRef.current.click()}
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            alt="Default Avatar"
            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover cursor-pointer self-center mt-2"
          />
        )}
      </div>

      {/* Message below image */}
      <p className="text-sm text-center mb-4">
        {fileUploadError ? (
          <span className="text-red-700">
            Error Image upload (image must be less than 2 MB)
          </span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
        ) : filePerc === 100 ? (
          <span className="text-green-700">Image successfully uploaded!</span>
        ) : (
          ''
        )}
      </p>

      <form className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Update
        </button>
      </form>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200"
        >
          Delete Account
        </button>
        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
