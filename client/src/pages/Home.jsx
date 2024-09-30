import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className='bg-gray-100 min-h-screen'>
      {/* Hero Section */}
      <div className='flex flex-col items-center gap-6 p-10 sm:p-28 max-w-6xl mx-auto text-center'>
        <h1 className='text-slate-800 font-bold text-4xl sm:text-6xl'>
          Find Your Next <span className='text-red-600'>Perfect</span> Place
        </h1>
        <p className='text-gray-500 text-lg sm:text-xl'>
          Sahand Estate is the best place to discover your dream property. Choose from a wide range of offers and locations.
        </p>
        <Link
          to={'/search'}
          className='text-lg sm:text-xl bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 transition'
        >
          Start Searching
        </Link>
      </div>

      {/* Full-Width Swiper Section */}
      <div className='w-full mb-10'>
        {offerListings.length > 0 && (
          <>
            <h2 className='text-3xl font-semibold text-center text-slate-700 mb-6 ' >Exclusive Offers</h2>
            <Swiper
              navigation
              spaceBetween={30}
              className='w-full h-[500px] rounded-none shadow-lg'
            >
              {offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div
                    style={{
                      backgroundImage: `url(${listing.imageUrls[0]})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                    className='h-full transition-transform duration-300 hover:scale-105'
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </div>

      {/* Listings Section */}
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Offers */}
        {offerListings.length > 0 && (
          <section className='mb-10'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-2xl font-semibold text-slate-700 underline underline-offset-8 decoration-red-500'>
                Recent Offers
              </h3>
              <Link className='text-red-600 hover:underline' to={'/search?offer=true'}>
                View All Offers
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Rent */}
        {rentListings.length > 0 && (
          <section className='mb-10'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-2xl font-semibold text-slate-700 underline underline-offset-8 decoration-red-500'>
                Places for Rent
              </h3>
              <Link className='text-red-600 hover:underline' to={'/search?type=rent'}>
                View All Rent Options
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}

        {/* Sale */}
        {saleListings.length > 0 && (
          <section>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-2xl font-semibold text-slate-700 underline underline-offset-8 decoration-red-500'>
                Places for Sale
              </h3>
              <Link className='text-red-600 hover:underline' to={'/search?type=sale'}>
                View All Sale Options
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
