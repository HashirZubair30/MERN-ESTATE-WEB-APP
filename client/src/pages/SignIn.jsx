import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSucess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSucess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='p-8 bg-white shadow-lg rounded-3xl max-w-md w-full transform transition-all duration-300 hover:scale-105'>
        <h1 className='text-4xl text-center font-bold text-gray-800 mb-6 animate-fade-in-down'>
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <input
            type='email'
            placeholder='Email'
            className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 shadow-md hover:shadow-lg'
            id='email'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 shadow-md hover:shadow-lg'
            id='password'
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className={`bg-gray-700 text-white p-4 rounded-lg uppercase font-semibold tracking-wide transition-all duration-300 transform hover:scale-105 hover:bg-gray-800 disabled:opacity-70 ${
              loading ? 'cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <OAuth />
        </form>

        <div className='flex justify-center gap-2 mt-5 text-sm'>
          <p>Don't have an account?</p>
          <Link to='/sign-up'>
            <span className='text-gray-700 font-semibold hover:underline'>
              Sign Up
            </span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
      </div>
    </div>
  );
}
