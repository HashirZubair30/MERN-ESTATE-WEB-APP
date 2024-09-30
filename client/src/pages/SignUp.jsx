import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='p-8 bg-white shadow-lg rounded-3xl max-w-md w-full transform transition-all duration-300 hover:scale-105'>
        <h1 className='text-4xl text-center font-bold text-gray-800 mb-6 animate-fade-in-down'>
          Create Account
        </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <input
            type='text'
            placeholder='Username'
            className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg'
            id='username'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='Email'
            className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg'
            id='email'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            className='border p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg'
            id='password'
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className={`bg-indigo-600 text-white p-4 rounded-lg uppercase font-semibold tracking-wide transition-all duration-300 transform hover:scale-105 hover:bg-indigo-700 disabled:opacity-70 ${
              loading ? 'cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          <OAuth />
        </form>
        <div className='flex justify-center gap-2 mt-5 text-sm'>
          <p>Have an account?</p>
          <Link to='/sign-in'>
            <span className='text-indigo-700 font-semibold hover:underline'>
              Sign In
            </span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
      </div>
    </div>
  );
}
