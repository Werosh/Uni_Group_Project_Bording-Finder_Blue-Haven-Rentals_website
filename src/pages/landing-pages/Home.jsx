import React, { useState } from "react";
import { Search, MapPin, Calendar, Users, Menu } from "lucide-react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All Property Types");
  const [guests, setGuests] = useState("Guests");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-50 relative overflow-hidden">
      {/* Background Image Divs */}
      <div className="absolute inset-0 flex">
        {/* Left Image Div - 20% width */}
        <div className="w-2/5 bg-cover bg-center bg-no-repeat opacity-20 bg-amber-500"></div>

        {/* Right Image Div - 80% width */}
        <div
          className="flex-1 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          }}
        ></div>
      </div>

      {/* Main Content - positioned above background images */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="px-6 pt-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
                  Discover Your
                  <br />
                  Perfect{" "}
                  <span className="text-cyan-500 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    Haven
                  </span>
                </h1>

                <p className="text-lg text-slate-600 mt-6 leading-relaxed max-w-lg">
                  Explore exceptional rental houses and boarding accommodations
                  tailored to your lifestyle. Your ideal space is just a search
                  away with Blue Haven Rentals.
                </p>
              </div>

              {/* Enhanced Search Card */}
              <div className="bg-white/80 max-w-3xl backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  {/* Location Search */}
                  <div className="flex-1">
                    <div className="flex items-center bg-gray-50 rounded-xl px-2 py-2 border border-gray-200 focus-within:border-cyan-500 transition-colors">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                      <input
                        type="text"
                        placeholder="Enter city, neighborhood, or landmark..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent flex-1 outline-none text-slate-700 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Property Type Dropdown */}
                  <div className="flex-1">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl px-2 py-2 outline-none text-slate-700 appearance-none cursor-pointer border border-gray-200 focus:border-cyan-500 transition-colors"
                    >
                      <option>All Property Types</option>
                      <option>House</option>
                      <option>Apartment</option>
                      <option>Boarding House</option>
                      <option>Studio</option>
                      <option>Villa</option>
                      <option>Condo</option>
                    </select>
                  </div>

                  {/* Guests Dropdown */}
                  <div className="flex-1">
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl px-2 py-2 outline-none text-slate-700 appearance-none cursor-pointer border border-gray-200 focus:border-cyan-500 transition-colors"
                    >
                      <option>Guests</option>
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3-4 Guests</option>
                      <option>5-8 Guests</option>
                      <option>9+ Guests</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <div>
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      <Search className="w-5 h-5 mr-2" />
                      Find
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">
                Why Choose Blue Haven?
              </h2>
              <p className="text-lg text-slate-700 max-w-4xl mx-auto leading-relaxed">
                From cozy boarding houses perfect for students and professionals
                to luxurious family homes with stunning views, we offer
                verified, high-quality accommodations that feel like home.
                Experience seamless booking, transparent pricing, and
                exceptional customer service that makes finding your perfect
                rental effortless.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-200/40 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-2xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default Home;
