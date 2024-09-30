import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'; // Ensure firebase app is correctly imported
import { 
  updateUserStart, updateUserSuccess, updateUserFailure,
  deleteUserFailure, deleteUserStart, deleteUserSuccess,
  signOutUserStart, signOutUserSuccess, signOutUserFailure 
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom'; // Import Link

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
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError,setshowListingsError]=useState(false);
  const [userListings,setUserListings]=useState([]);

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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/sign-in'); // Redirect to sign-in after account deletion
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate('/sign-in'); // Redirect to sign-in after logout
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        password: '',
        avatar: currentUser.avatar, // Fetch avatar from the backend
      });
    }
  }, [currentUser]);



  const handleShowListings=async()=>{
    try {
      const res=await fetch(`/api/user/listings/${currentUser._id}`);
      const data=await res.json();
      if(data.success===false){
        setshowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setshowListingsError(true);
    }
  }


  const handleListingDelete=async(listingId)=>{
    try {
     const res=await fetch(`/api/listing/delete/${listingId}`,{
      method:'DELETE',
     }) 
     const data=await res.json();
     if(data.success===false){
      console.log(data.message);
      return;
     }
     setUserListings((prev)=>prev.filter((listing)=>listing._id !==listingId));
    } catch (error) {
      console.log(error.message)
    }
  }

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

      <form className="space-y-4" onSubmit={handleSubmit}>
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
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Update
        </button>
      </form>

      {/* Add button with navigation to create listing page */}
      <div className="mt-6">
        <Link to="/create-Listing">
          <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200">
            Go to Create Listing
          </button>
        </Link>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleDeleteUser}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-200"
        >
          Delete Account
        </button>
        <button
          onClick={handleSignOut}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-200"
        >
          Sign Out
        </button>
      </div>



      {updateSuccess && (
        <p className="text-green-500 mt-4 text-center">
          Profile updated successfully!
        </p>
      )}
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>
         {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}



    </div>
  );
}
