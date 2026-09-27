import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f3f4f6] font-sans">
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white py-5'}`}>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-[#1a3a2a]">
            <Leaf className="w-8 h-8" />
            <span className="font-bold text-2xl tracking-tight">FoodLoop</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-[#16a34a] font-medium transition-colors">How It Works</a>
            <a href="#impact" className="text-gray-600 hover:text-[#16a34a] font-medium transition-colors">Impact</a>
            <a href="#about" className="text-gray-600 hover:text-[#16a34a] font-medium transition-colors">About</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-5 py-2 text-[#16a34a] border border-[#16a34a] rounded-xl font-medium hover:bg-green-50 transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2 bg-[#16a34a] text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full relative pl-15 pt-32 pr-15 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-[#0f2d1a] to-[#1a4a2a]">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                Turning Today's Leftovers<br />
                <span className="text-[#16a34a]">Into Tomorrow's Meals</span>
              </h1>
              <p className="text-xl text-white/70 mb-10 max-w-2xl leading-relaxed">
                FoodLoop connects institutional kitchens, NGOs, and delivery agents to eliminate food waste â€” powered by AI-driven prep predictions.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
                <Link to="/signup" className="px-8 py-4 bg-white text-[#1a3a2a] rounded-xl font-bold text-lg text-center hover:bg-gray-100 transition-colors shadow-lg">
                  Join as a Kitchen
                </Link>
                <Link to="/signup" className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg text-center hover:bg-white/10 transition-colors">
                  Join as NGO / Rider
                </Link>
              </div>
              
              {/* Stat Chips */}
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-[0_0_15px_rgba(22,163,74,0.3)]">
                  ðŸ± 12,400 kg food redistributed
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-[0_0_15px_rgba(22,163,74,0.3)]">
                  ðŸ¤ 340+ NGO partners
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-[0_0_15px_rgba(22,163,74,0.3)]">
                  ðŸšš 2,100 daily meals served
                </div>
              </div>
            </div>

            {/* Right Side Mockup */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-[#16a34a] blur-[100px] opacity-20 rounded-full"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-md ml-auto">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">City Hospital Kitchen</h3>
                    <p className="text-sm text-gray-500">Central District â€¢ 2.5 km away</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    8.2 kg Total
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mixed Veg Curry</span>
                    <span className="font-medium text-gray-900">4.5 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Steamed Rice</span>
                    <span className="font-medium text-gray-900">2.0 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dal Tadka</span>
                    <span className="font-medium text-gray-900">1.7 kg</span>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-center text-blue-800 text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-blue-600" />
                  Quality Checked â€¢ Temp: 65Â°C
                </div>
                <button className="w-full bg-[#1e6fba] text-white font-medium py-3 rounded-xl shadow-sm hover:bg-blue-700 transition-colors">
                  Claim Surplus Now
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">Pickup by 8:30 PM today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How FoodLoop Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">A seamless, AI-powered loop from kitchen to community.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative z-10 text-center">
              {/* <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-white shadow-sm">ðŸ¤–</div> */}
              <h3 className="font-bold text-gray-900 mb-2">1. ML Predicts Demand</h3>
              <p className="text-gray-600 text-sm">Our AI analyses 30-day history to suggest exact prep quantities</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative z-10 text-center">
              {/* <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-white shadow-sm">âš–ï¸</div> */}
              <h3 className="font-bold text-gray-900 mb-2">2. Kitchen Prepares</h3>
              <p className="text-gray-600 text-sm">Kitchen logs morning prep and evening remaining weights</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative z-10 text-center">
              {/* <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-white shadow-sm">ðŸ“¦</div> */}
              <h3 className="font-bold text-gray-900 mb-2">3. Surplus Detected</h3>
              <p className="text-gray-600 text-sm">System auto-detects surplus and lists it on the marketplace</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative z-10 text-center">
              {/* <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-white shadow-sm">ðŸšš</div> */}
              <h3 className="font-bold text-gray-900 mb-2">4. NGOs Claim It</h3>
              <p className="text-gray-600 text-sm">Verified NGOs and riders coordinate pickup within hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-24 bg-[#f3f4f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Built for every link in the chain</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border-t-4 border-t-[#16a34a] border-l border-r border-b border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* <div className="text-4xl mb-6">ðŸ½ï¸</div> */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">Institutional Kitchens</h3>
              <p className="text-gray-600 mb-8 flex-grow">Reduce waste by 40%, cut food costs, get AI prep guidance every morning based on historical trends.</p>
              <Link to="/signup" className="text-[#16a34a] font-bold flex items-center hover:underline group">
                Join as Kitchen <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border-t-4 border-t-[#1e6fba] border-l border-r border-b border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* <div className="text-4xl mb-6">ðŸ¤</div> */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">NGOs & Distributors</h3>
              <p className="text-gray-600 mb-8 flex-grow">Access real-time surplus marketplace, claim food seamlessly, coordinate volunteers and track impact.</p>
              <Link to="/signup" className="text-[#1e6fba] font-bold flex items-center hover:underline group">
                Join as NGO <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border-t-4 border-t-purple-500 border-l border-r border-b border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              {/* <div className="text-4xl mb-6">ðŸšš</div> */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Agents</h3>
              <p className="text-gray-600 mb-8 flex-grow">Get pickup assignments, track optimized routes, earn per delivery while making a real difference.</p>
              <Link to="/signup" className="text-purple-600 font-bold flex items-center hover:underline group">
                Join as Rider <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section id="impact" className="py-20 bg-[#1a3a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">12,400 <span className="text-2xl font-medium text-white/60">kg</span></div>
              <div className="text-[#16a34a] font-medium">Food Redistributed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">340+</div>
              <div className="text-[#16a34a] font-medium">NGO Partners</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">2,100</div>
              <div className="text-[#16a34a] font-medium">Daily Meals</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">2.1<span className="text-2xl font-medium text-white/60">T</span></div>
              <div className="text-[#16a34a] font-medium">CO‚ Prevented</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Voices from the Loop</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="text-[#16a34a] mb-4">
                
              </div>
              <p className="text-gray-700 italic mb-6">"We cut our daily food waste from 18 kg to under 3 kg in just 2 weeks. The AI predictions are uncannily accurate."</p>
              <div>
                <p className="font-bold text-gray-900">Chef Ramesh</p>
                <p className="text-sm text-gray-500">City Hospital Kitchen</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="text-[#16a34a] mb-4">
                
              </div>
              <p className="text-gray-700 italic mb-6">"We now receive 40+ kg of quality surplus food every day for our community kitchen. The app makes logistics effortless."</p>
              <div>
                <p className="font-bold text-gray-900">Priya M.</p>
                <p className="text-sm text-gray-500">Asha Foundation NGO</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="text-[#16a34a] mb-4">
                
              </div>
              <p className="text-gray-700 italic mb-6">"I earn â‚¹500-800 extra per day just doing 2-3 pickups in my area during my free time. Highly recommend!"</p>
              <div>
                <p className="font-bold text-gray-900">Arjun D.</p>
                <p className="text-sm text-gray-500">Delivery Rider</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-r from-[#0f2d1a] to-[#1a4a2a] text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to close the loop?</h2>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login" className="px-8 py-4 bg-white/10 text-white border border-white/30 rounded-xl font-bold hover:bg-white/20 transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-8 py-4 bg-[#16a34a] text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 text-white mb-4">
                <Leaf className="w-6 h-6 text-[#16a34a]" />
                <span className="font-bold text-xl tracking-tight">FoodLoop</span>
              </Link>
              <p className="text-sm max-w-sm">
                Eliminating food waste through intelligent predictions and seamless redistribution networks.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="mailto:support@foodloop.app" className="hover:text-white transition-colors mt-4 block text-[#16a34a]">support@foodloop.app</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center md:text-left">
            <p>&copy; 2026 FoodLoop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

