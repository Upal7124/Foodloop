import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSurplusListings, updateListingStatus } from '../data/surplusData';
import { format } from 'date-fns';
import { Truck, Package, MapPin, Clock, Star, CheckCircle2, Navigation, Phone, DollarSign, TrendingUp, Zap, ToggleLeft, ToggleRight, ArrowRight } from 'lucide-react';

export default function RiderDashboard() {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [listings, setListings] = useState([
    { date: '26 Sep', kitchen: 'City Hospital Kitchen', items: 'Steamed Rice + Dal Tadka', distance: '4.2km', payout: 'Rs 540', status: 'available' },
    { date: '26 Sep', kitchen: 'Green Plate Corporate', items: 'Wheat Chapati + Mixed Veg Curry + Curd Veg', distance: '2.8km', payout: 'Rs 320', status: 'available' },]);
  
  useEffect(() => {
    // Fetch listings
    setListings(getSurplusListings() || []);
  }, []);

  const refreshListings = () => {
    setListings(getSurplusListings() || []);
  };

  const activeAssignment = listings.find(l => l.status === 'claimed');
  const availablePickups = listings.filter(l => l.status === 'available').slice(0, 4);

  const handleAcceptPickup = (id) => {
    updateListingStatus(id, 'claimed', user?.name);
    refreshListings();
  };

  const handleMarkDelivered = (id) => {
    updateListingStatus(id, 'delivered', user?.name);
    refreshListings();
  };

  // Mock distance and payout once
  const pickupsWithDetails = useMemo(() => {
    return availablePickups.map(p => ({
      ...p,
      distance: (Math.random() * 7 + 1).toFixed(1),
      payout: Math.floor(Math.random() * 121) + 80
    }));
  }, [availablePickups]);

  const mockHistory = [
    { date: '26 Sep', kitchen: 'City Hospital Kitchen', items: 'Steamed Rice + Dal Tadka', distance: '4.2km', payout: 'Rs 630', status: 'Delivered' },
    { date: '26 Sep', kitchen: 'Green Plate Corporate', items: 'Wheat Chapati + Mixed Veg Curry + Curd Veg', distance: '2.8km', payout: 'Rs 250', status: 'Delivered' },
    { date: '25 Sep', kitchen: 'Metro Canteen', items: 'Vegetable Khichdi', distance: '6.1km', payout: 'Rs 730', status: 'Delivered' },
    { date: '25 Sep', kitchen: 'EduCare Hostel', items: 'Mixed Veg Curry + Curd', distance: '3.5km', payout: 'Rs 320', status: 'Delivered' },
    { date: '24 Sep', kitchen: 'City Hospital Kitchen', items: 'Dal Tadka + Steamed Rice', distance: '5.2km', payout: '650', status: 'Delivered' },
  ];

  return (
    <div className="mt-5 space-y-6 w-full mx-auto pb-10">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between shadow-lg" style={{ background: 'linear-gradient(135deg, #09da1e 0%, #0d3e0d 100%)' }}>
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name || 'Rider'}!
          </h1>
          <p className="text-black-200 flex items-center gap-2 text-sm">
            <Truck size={16} /> {user?.vehicleType || 'Delivery Agent'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4 bg-white/10 px-4 py-3 rounded-xl border border-white/20">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-gray-400'}`}></span>
            <span className="text-sm font-medium">{isAvailable ? 'Available for pickups' : 'Offline'}</span>
          </div>
          <button 
            onClick={() => setIsAvailable(!isAvailable)}
            className="text-white hover:text-purple-200 transition-colors"
          >
            {isAvailable ? <ToggleRight size={28} className="text-green-400" /> : <ToggleLeft size={28} />}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: Truck, label: "Today's Deliveries", value: '3', color: 'text-purple-600', bg: 'bg-purple-100' },
          { icon: Package, label: "This Week", value: '18', color: 'text-blue-600', bg: 'bg-blue-100' },
          { icon: Star, label: "Rating", value: '4.8 / 5.0', color: 'text-yellow-600', bg: 'bg-yellow-100' },
          { icon: DollarSign, label: "Earnings Today", value: 'Rs 540',color: 'text-green-600', bg: 'bg-green-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Assignment */}
          <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-purple-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap size={20} className="text-purple-600" /> Active Assignment
              </h2>
              {activeAssignment && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">In Progress</span>
              )}
            </div>
            <div className="p-5">
              {activeAssignment ? (
                <div className="space-y-5">
                  <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-purple-600 border-2 border-white shadow-sm"></div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">PICKUP FROM</p>
                      <p className="text-sm font-bold text-gray-900">{activeAssignment.kitchenName}</p>
                      <p className="text-xs text-gray-600 mt-0.5">Mock Address 123, FoodLoop City</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">DELIVER TO</p>
                      <p className="text-sm font-bold text-gray-900">Asha Foundation</p>
                      <p className="text-xs text-gray-600 mt-0.5">Mock NGO Address 456, FoodLoop City</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Items to deliver</p>
                      {/* <p className="text-sm font-medium text-gray-900">{activeAssignment.items || 'Mixed Veg Curry + Curd Food Items'} ({activeAssignment.totalKg} kg)</p> */}
                    </div>
                    <Package size={20} className="text-gray-400" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => window.alert('Opening Google Maps...')}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Navigation size={16} /> Navigate
                    </button>
                    <button 
                      onClick={() => handleMarkDelivered(activeAssignment.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle2 size={16} /> Mark as Delivered
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck size={28} className="text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium">No active assignment</p>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">Toggle your availability to start receiving new pickup requests.</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery History */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Deliveries</h2>
              <button className="text-sm text-purple-600 font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Kitchen</th>
                    <th className="px-5 py-3">Items</th>
                    <th className="px-5 py-3">Distance</th>
                    <th className="px-5 py-3">Payout</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockHistory.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-gray-500">{row.date}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{row.kitchen}</td>
                      <td className="px-5 py-3 text-gray-600">{row.items}</td>
                      <td className="px-5 py-3 text-gray-500">{row.distance}</td>
                      <td className="px-5 py-3 font-semibold text-gray-900">{row.payout}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                          <CheckCircle2 size={12} /> {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Earnings Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Earnings Summary</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-500 text-sm">This Week</span>
                <span className="text-lg font-bold text-gray-900">Rs 1,840</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-gray-500 text-sm">This Month</span>
                <span className="text-lg font-bold text-gray-900">Rs 6,420</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Pending Clearance</span>
                <span className="text-lg font-bold text-yellow-600">Rs 320</span>
              </div>
              
              <button 
                onClick={() => window.alert('Bank transfer will be processed in 2 business days')}
                className="w-full mt-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Request Withdrawal
              </button>
            </div>
          </div>

          {/* Available Pickups */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Available Pickups</h2>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {isAvailable ? availablePickups.length : 0}
              </span>
            </div>
            
            <div className="p-0">
              {!isAvailable ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  Toggle your availability above to see pickup requests
                </div>
              ) : pickupsWithDetails.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No pickups available right now. Check back later!
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pickupsWithDetails.map((pickup, i) => (
                    <div key={i} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-900">{pickup.kitchenName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} /> {pickup.distance} km away
                          </p>
                        </div>
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                          Rs {pickup.payout}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {/* <span className="font-medium text-gray-800">{pickup.totalKg} kg</span> â€¢ {pickup.items} */}
                      </div>
                      <button 
                        onClick={() => handleAcceptPickup(pickup.id)}
                        disabled={!!activeAssignment}
                        className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Accept Pickup
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


