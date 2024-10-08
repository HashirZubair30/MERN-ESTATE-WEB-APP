import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-transparent shadow-md sticky top-0 z-50'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        {/* Logo Section */}
        <Link to='/'>
          <h1 className='font-bold text-2xl sm:text-3xl flex items-center'>
            <span className='text-red-500'>Hashir</span>
            <span className='text-gray-800'>Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className='bg-gray-100 p-2 sm:p-3 rounded-full flex items-center shadow-lg'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64 text-gray-700 px-2'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='bg-red-500 p-2 rounded-full hover:bg-red-600 transition duration-300'>
            <FaSearch className='text-white' />
          </button>
        </form>

        {/* Navigation Links */}
        <ul className='flex gap-6 items-center'>
          <Link to='/'>
            <li className='hidden sm:inline text-gray-800 hover:text-red-500 transition duration-200 font-semibold'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-gray-800 hover:text-red-500 transition duration-200 font-semibold'>
              About
            </li>
          </Link>

          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-10 w-10 object-cover border-2 border-red-500 shadow-md'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='text-gray-800 hover:text-red-500 transition duration-200 font-semibold'>
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
