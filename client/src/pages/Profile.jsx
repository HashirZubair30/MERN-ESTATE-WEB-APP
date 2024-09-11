import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = () => {
    // Handle form update logic here
    console.log('Update Profile:', formData);
  };

  const handleDeleteAccount = () => {
    // Handle delete account logic here
    console.log('Delete Account');
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout');
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Profile</h1>

      {/* Avatar Image */}
      <div className="flex justify-center mb-6">
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
          />
        ) : (
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            alt="Default Avatar"
            className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
          />
        )}
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
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
