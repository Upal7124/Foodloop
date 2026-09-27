import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSurplusListings, updateListingStatus } from '../data/surplusData';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Package, MapPin, Clock, ShoppingBag, CheckCircle2, AlertTriangle, Leaf, TrendingUp, Users, Truck, BarChart2, ArrowRight, Star } from 'lucide-react';

const NGODashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback user if context isn't fully mocked
  const currentUser = user || { name: 'Sarah', orgName: 'Asha Foundation' };

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = () => {
    // In a real app, this would be an async API call
    setLoading(true);
    try {
      const data = getSurplusListings();
      setListings(data || []);
    } catch (e) {
      console.error(e);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = (id) => {
    try {
      updateListingStatus(id, 'claimed', currentUser.name);
      fetchListings();
    } catch (e) {
      console.error(e);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const availableListings = listings.filter(l => l.status === 'available').slice(0, 5);
  const claimedThisWeekCount = listings.filter(l => l.status === 'claimed').length;

  // Mock recent claims
  const recentClaims = [
    { id: 1, kitchen: 'City Hospital Kitchen', kg: 8.2, date: '2 days ago', status: 'Completed' },
    { id: 2, kitchen: 'Green Plate Corporate', kg: 12.1, date: '4 days ago', status: 'Completed' },
    { id: 3, kitchen: 'Metro Canteen', kg: 5.8, date: '1 week ago', status: 'Completed' }
  ];

  // Mock upcoming pickups
  const upcomingPickups = [
    { id: 101, kitchen: 'EduCare Hostel', address: '12 MG Road, City Center', time: 'Today, 8:30 PM', items: 3 },
    { id: 102, kitchen: 'City Hospital Kitchen', address: '45 Park Street, East Wing', time: 'Today, 9:15 PM', items: 5 },
    { id: 103, kitchen: 'Metro Canteen', address: 'Block C, Tech Hub', time: 'Tomorrow, 10:00 AM', items: 2 }
  ];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#276221] to-[#8bca84] rounded-2xl p-8 mb-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Leaf className="w-64 h-64 -mt-16 -mr-16" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {currentUser.name}!
            </h1>
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-blue-100 text-lg">{currentUser.orgName || currentUser.restaurant || 'NGO Partner'}</span>
              <span className="bg-[#46923c]-800 text-blue-100 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/100">
                NGO / Distributor
              </span>
            </div>
            <p className="text-lg bg-white/20 inline-block px-4 py-2 rounded-lg backdrop-blur-sm">
              <span className="font-bold">{availableListings.length}</span> surplus listings available near you
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Link to="/surplus-marketplace" className="px-6 py-3 bg-white text-[#46923c] font-bold rounded-xl hover:bg-gray-100 transition shadow-sm text-center">
              Browse Marketplace
            </Link>
            <button className="px-6 py-3 border border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition text-center">
              View My Claims
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg text-[#1e6fba]">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Food Claimed</p>
            <p className="text-2xl font-bold text-gray-900">24 <span className="text-sm font-normal text-gray-500">listings</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Meals Served</p>
            <p className="text-2xl font-bold text-gray-900">8,640</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pickups This Week</p>
            <p className="text-2xl font-bold text-gray-900">{claimedThisWeekCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="bg-teal-100 p-3 rounded-lg text-teal-600">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">COâ‚‚ Prevented</p>
            <p className="text-2xl font-bold text-gray-900">1.2<span className="text-sm font-normal text-gray-500">T</span></p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left Column (60%) */}
        <div className="lg:col-span-7">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              Available Near You
              <span className="relative flex h-3 w-3 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </h2>
            <Link to="/surplus-marketplace" className="text-sm text-[#1e6fba] font-medium hover:underline flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
                Loading listings...
              </div>
            ) : availableListings.length > 0 ? (
              availableListings.map(listing => (
                <div key={listing.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{listing.kitchenName}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1" /> {listing.city}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full mb-2">
                        {listing.totalKg} kg Total
                      </span>
                      {listing.mlGenerated && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" /> ML-Tracked
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.items && listing.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md">
                        {item.name} ({item.kg} kg)
                      </span>
                    ))}
                    {listing.items && listing.items.length > 3 && (
                      <span className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-md">
                        +{listing.items.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      Pickup by <span className="font-semibold text-gray-900 ml-1">{format(new Date( Date.now() + 7200000), 'h:mm a')}</span>
                    </div>
                    <button 
                      onClick={() => handleClaim(listing.id)}
                      className="px-5 py-2 bg-[#46923c] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                      Claim Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No listings right now</h3>
                <p className="text-gray-500 mb-4">There are currently no surplus listings available in your area. Check back soon!</p>
              </div>
            )}
            
            {availableListings.length > 0 && (
              <Link to="/surplus-marketplace" className="block w-full py-3 bg-blue-50 text-[#1e6fba] text-center font-semibold rounded-xl hover:bg-blue-100 transition">
                Browse Full Marketplace
              </Link>
            )}
          </div>
        </div>
        
        {/* Right Column (40%) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/surplus-marketplace" className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#1e6fba] transition-colors group border border-gray-100">
                <ShoppingBag className="w-6 h-6 mb-2 text-gray-400 group-hover:text-[#1e6fba]" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e6fba]">Browse All</span>
              </Link>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#1e6fba] transition-colors group border border-gray-100">
                <Package className="w-6 h-6 mb-2 text-gray-400 group-hover:text-[#1e6fba]" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e6fba]">My Claims</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#1e6fba] transition-colors group border border-gray-100">
                <Clock className="w-6 h-6 mb-2 text-gray-400 group-hover:text-[#1e6fba]" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e6fba]">Schedule</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#1e6fba] transition-colors group border border-gray-100">
                <BarChart2 className="w-6 h-6 mb-2 text-gray-400 group-hover:text-[#1e6fba]" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#1e6fba]">Reports</span>
              </button>
            </div>
          </div>
          
          {/* Recent Claims */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Claims</h2>
              <button className="text-sm text-[#1e6fba] hover:underline">See all</button>
            </div>
            <div className="space-y-4">
              {recentClaims.map((claim, idx) => (
                <div key={claim.id} className={`${idx !== recentClaims.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{claim.kitchen}</h4>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      {claim.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{claim.kg} kg total</span>
                    <span>{claim.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* Upcoming Pickups */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Expected Listings</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {upcomingPickups.map(pickup => (
            <div key={pickup.id} className="bg-white p-5 rounded-xl border-l-4 border-l-[#46923c] border-t border-r border-b border-gray-200 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-900 line-clamp-1">{pickup.kitchen}</h3>
                <span className="bg-[#1e6fba]-50 text-[#1e6fba]-700 text-xs  px-2 py-1 rounded">
                  {pickup.items} items
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center mb-4 flex-grow">
                <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-1">{pickup.address}</span>
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center text-sm font-semibold text-gray-800">
                  <Clock className="w-4 h-4 mr-1.5 text-green-500" />
                  {pickup.time}
                </div>
                <button className="text-sm font-bold text-[#49623c] hover:underline">
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default NGODashboard;

