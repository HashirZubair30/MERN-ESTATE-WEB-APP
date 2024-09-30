import React from 'react';

export default function About() {
  return (
    <div className='py-20 px-4 bg-gray-50'>
      <div className='max-w-6xl mx-auto'>
        {/* Heading Section */}
        <h1 className='text-4xl font-extrabold mb-6 text-gray-800 text-center'>
          About <span className='text-red-600'>Hashir Estate</span>
        </h1>

        {/* Divider */}
        <div className='w-20 h-1 bg-red-600 mx-auto mb-10'></div>

        {/* About Content Section */}
        <p className='mb-6 text-lg text-gray-700 leading-relaxed'>
          Hashir Estate is a leading real estate agency specializing in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our experienced agents are dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
        </p>
        
        <p className='mb-6 text-lg text-gray-700 leading-relaxed'>
          Our mission is to help our clients achieve their real estate goals by offering expert advice, personalized service, and a deep understanding of the local market. Whether you're looking to buy, sell, or rent a property, we are here to assist you every step of the way.
        </p>
        
        <p className='mb-6 text-lg text-gray-700 leading-relaxed'>
          Our team of agents brings a wealth of experience and industry knowledge, committed to delivering the highest level of service. We believe buying or selling property should be an exciting and rewarding experience, and we strive to make that a reality for each client.
        </p>

        {/* Call to Action Section */}
        <div className='mt-10 text-center'>
          <h2 className='text-2xl font-semibold text-gray-800'>
            Ready to Work with Us?
          </h2>
          <p className='text-lg text-gray-600 mb-6'>
            Contact us today to discuss your real estate needs.
          </p>
          <button className='bg-red-600 text-white py-3 px-8 rounded-lg shadow-md hover:bg-red-700 transition duration-300'>
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
