import { useState, useRef, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
  FaSlidersH,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdFilterList } from "react-icons/md";

// Data from Location.jsx
const DISTRICTS = [
  { name: "Colombo", lat: 6.927079, lng: 79.861244, province: "Western" },
  { name: "Gampaha", lat: 7.0917, lng: 79.9999, province: "Western" },
  { name: "Kalutara", lat: 6.5854, lng: 79.9607, province: "Western" },
  { name: "Kandy", lat: 7.2906, lng: 80.6337, province: "Central" },
  { name: "Matale", lat: 7.4675, lng: 80.6234, province: "Central" },
  { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, province: "Central" },
  { name: "Galle", lat: 6.0535, lng: 80.221, province: "Southern" },
  { name: "Matara", lat: 5.9549, lng: 80.5549, province: "Southern" },
  { name: "Hambantota", lat: 6.1248, lng: 81.1134, province: "Southern" },
  { name: "Jaffna", lat: 9.6615, lng: 80.0255, province: "Northern" },
  { name: "Kilinochchi", lat: 9.3803, lng: 80.376, province: "Northern" },
  { name: "Mannar", lat: 8.9776, lng: 79.9058, province: "Northern" },
  { name: "Vavuniya", lat: 8.7514, lng: 80.497, province: "Northern" },
  { name: "Mullaitivu", lat: 9.2671, lng: 80.8128, province: "Northern" },
  { name: "Trincomalee", lat: 8.5874, lng: 81.2152, province: "Eastern" },
  { name: "Batticaloa", lat: 7.7102, lng: 81.6924, province: "Eastern" },
  { name: "Ampara", lat: 7.2973, lng: 81.682, province: "Eastern" },
  { name: "Kurunegala", lat: 7.4863, lng: 80.3623, province: "North Western" },
  { name: "Puttalam", lat: 8.0362, lng: 79.839, province: "North Western" },
  {
    name: "Anuradhapura",
    lat: 8.3114,
    lng: 80.4037,
    province: "North Central",
  },
  { name: "Polonnaruwa", lat: 7.9403, lng: 81.0188, province: "North Central" },
  { name: "Badulla", lat: 6.989, lng: 81.056, province: "Uva" },
  { name: "Monaragala", lat: 6.8726, lng: 81.3509, province: "Uva" },
  { name: "Ratnapura", lat: 6.7056, lng: 80.3847, province: "Sabaragamuwa" },
  { name: "Kegalle", lat: 7.2507, lng: 80.345, province: "Sabaragamuwa" },
];

const PROVINCE_ORDER = [
  "Western",
  "Eastern",
  "Northern",
  "Central",
  "Southern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

const PROPERTY_TYPES = [
  "Any Property Type",
  "Apartment",
  "House",
  "Villa",
  "Land",
  "Commercial",
  "Room",
];

// Categories from Categories.jsx
const CATEGORIES = [
  "Single Rooms",
  "Double Rooms",
  "Boarding Houses",
  "Hostels",
  "Sharing Rooms",
  "Annexes",
  "Houses",
  "Apartments",
  "Single Bedrooms",
];

// Mock data for rental posts
const MOCK_POSTS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Comfortable Room in Heart of ${DISTRICTS[i % DISTRICTS.length].name}`,
  location: `${DISTRICTS[i % DISTRICTS.length].name}, ${
    DISTRICTS[i % DISTRICTS.length].province
  }`,
  district: DISTRICTS[i % DISTRICTS.length].name,
  province: DISTRICTS[i % DISTRICTS.length].province,
  price: 15000 + Math.floor(Math.random() * 70000),
  category: CATEGORIES[i % CATEGORIES.length],
  imageUrl:
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
}));

const BrowsePlacePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES[0]);
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [expandedProvinces, setExpandedProvinces] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const propRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        propertyTypeOpen &&
        propRef.current &&
        !propRef.current.contains(e.target)
      ) {
        setPropertyTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [propertyTypeOpen]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleDistrict = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
    setCurrentPage(1);
  };

  const toggleProvince = (province) => {
    setExpandedProvinces((prev) =>
      prev.includes(province)
        ? prev.filter((p) => p !== province)
        : [...prev, province]
    );
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    }
    if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0];
    }
    setPriceRange(newRange);
    setCurrentPage(1);
  };

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(post.category);

      const matchesDistrict =
        selectedDistricts.length === 0 ||
        selectedDistricts.includes(post.district);

      const matchesPrice =
        post.price >= priceRange[0] && post.price <= priceRange[1];

      return (
        matchesSearch && matchesCategory && matchesDistrict && matchesPrice
      );
    });
  }, [searchQuery, selectedCategories, selectedDistricts, priceRange]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const districtsByProvince = useMemo(() => {
    const grouped = {};
    PROVINCE_ORDER.forEach((province) => {
      grouped[province] = DISTRICTS.filter((d) => d.province === province);
    });
    return grouped;
  }, []);

  const openInMaps = () => {
    window.open(
      `https://www.google.com/maps/search/rental+properties+sri+lanka`,
      "_blank"
    );
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl mt-10 p-4 border border-white/40 shadow-lg">
        <h3 className="text-[#263D5D] font-bold text-lg mb-3 flex items-center gap-2">
          <MdFilterList /> Categories
        </h3>
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {CATEGORIES.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#3ABBD0]/10 cursor-pointer transition"
            >
              <input
                type="checkbox"
                className="accent-[#3ABBD0] w-4 h-4"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              <span className="text-sm text-[#263D5D] font-poppins">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Locations Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-lg">
        <h3 className="text-[#263D5D] font-bold text-lg mb-3">Locations</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {PROVINCE_ORDER.map((province) => (
            <div key={province} className="border-b border-gray-200 pb-2">
              <button
                onClick={() => toggleProvince(province)}
                className="w-full flex items-center justify-between px-2 py-2 hover:bg-[#3ABBD0]/10 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-[#263D5D]">
                  {province}
                </span>
                {expandedProvinces.includes(province) ? (
                  <FaChevronUp className="text-[#263D5D]" size={12} />
                ) : (
                  <FaChevronDown className="text-[#263D5D]" size={12} />
                )}
              </button>
              {expandedProvinces.includes(province) && (
                <div className="ml-4 mt-2 space-y-1">
                  {districtsByProvince[province].map((district) => (
                    <label
                      key={district.name}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#3ABBD0]/5 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        className="accent-[#3ABBD0] w-4 h-4"
                        checked={selectedDistricts.includes(district.name)}
                        onChange={() => toggleDistrict(district.name)}
                      />
                      <span className="text-xs text-[#263D5D] font-poppins">
                        {district.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* View Map Button */}
      <button
        onClick={openInMaps}
        className="w-full relative overflow-hidden flex items-center gap-2 bg-[#263D5D] hover:bg-[#303435] text-white rounded-2xl px-4 py-3 shadow-lg border border-white/20 hover:scale-105 transition group"
      >
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-400 text-black">
          <FaChevronRight />
        </span>
        <span className="font-semibold tracking-wide font-poppins">
          View Map
        </span>
        <div className="absolute inset-0 rounded-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </button>

      {/* Price Range Section */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-lg">
        <h3 className="text-[#263D5D] font-bold text-lg mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <span className="px-4 py-2 bg-[#3ABBD0]/20 text-[#263D5D] font-semibold rounded-xl text-sm">
              Rs. {priceRange[0].toLocaleString()} - Rs.{" "}
              {priceRange[1].toLocaleString()}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#263D5D] font-poppins mb-1 block">
                Min: Rs. {priceRange[0].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3ABBD0]"
              />
            </div>
            <div>
              <label className="text-xs text-[#263D5D] font-poppins mb-1 block">
                Max: Rs. {priceRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="5000"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3ABBD0]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-[#263D5D] text-white p-3 rounded-full shadow-lg hover:bg-[#303435] transition"
      >
        {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="relative z-10 flex max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:sticky top-0 left-0 h-screen w-[280px] lg:w-[320px] 
          bg-white/20 backdrop-blur-sm border-r border-white/30 
          overflow-y-auto p-4 pt-20 lg:pt-6 z-40
          transform transition-transform duration-300
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
        >
          <SidebarContent />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-20 lg:pt-6 mt-10">
          {/* Header */}
          <div className="text-center mb-6 animate-fadeInUp">
            <h1 className="text-[48px] md:text-[72px] lg:text-[80px] leading-none font-['Hugiller_DEMO']">
              <span className="text-[#263D5D]">Browse </span>
              <span className="text-[#3ABBD0]">Place</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6 animate-slideInRight relative">
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-4 w-full flex flex-col md:flex-row items-center gap-4 shadow-2xl border border-white/30">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none"></div>

              {/* Search Input */}
              <div className="relative group flex-1 w-full z-10">
                <div className="bg-gray-50/80 backdrop-blur-sm shadow-md h-[64px] flex items-center px-4 gap-3 rounded-2xl border-2 border-[#3ABBD0]/30 focus-within:border-[#3ABBD0] transition-all duration-300 group-hover:border-[#3ABBD0]/50 focus-within:ring-4 focus-within:ring-[#3ABBD0]/20">
                  <FaSearch className="text-[#263D5D] opacity-70" size={18} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] text-[#263D5D] font-poppins focus:outline-none placeholder-[#263D5D]/70"
                    placeholder="Search by location or property name"
                  />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div
                ref={propRef}
                className="relative group w-full md:w-[240px] z-20"
              >
                <button
                  onClick={() => setPropertyTypeOpen((v) => !v)}
                  className="bg-gray-50/80 backdrop-blur-sm shadow-md h-[64px] w-full flex items-center px-4 gap-3 rounded-2xl border-2 border-[#3ABBD0]/30 focus:border-[#3ABBD0] transition-all duration-300 group-hover:border-[#3ABBD0]/50 focus:ring-4 focus:ring-[#3ABBD0]/20 cursor-pointer"
                >
                  <FaSlidersH className="text-[#263D5D] opacity-70" size={18} />
                  <span className="text-[14px] text-[#263D5D] font-poppins opacity-70 truncate flex-1 text-left">
                    {propertyType}
                  </span>
                  <FaChevronDown
                    className="text-[#263D5D] opacity-60"
                    size={12}
                  />
                </button>
                {propertyTypeOpen && (
                  <div className="absolute z-30 mt-2 w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#3ABBD0]/20 overflow-hidden">
                    {PROPERTY_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setPropertyType(t);
                          setPropertyTypeOpen(false);
                        }}
                        className={[
                          "w-full text-left px-4 py-3 text-sm font-poppins hover:bg-[#3ABBD0]/10 transition",
                          t === propertyType
                            ? "bg-[#3ABBD0]/10 text-[#263D5D] font-medium"
                            : "text-[#263D5D]",
                        ].join(" ")}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-[#263D5D] font-poppins text-sm">
            Showing {paginatedPosts.length} of {filteredPosts.length} properties
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedPosts.map((post) => (
              <div
                key={post.id}
                className="group bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-[#3ABBD0] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Rs. {post.price.toLocaleString()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[#263D5D] font-semibold text-lg mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#263D5D]/70 text-sm font-poppins mb-1">
                    {post.location}
                  </p>
                  <p className="text-[#3ABBD0] text-xs font-poppins">
                    {post.category}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-xl border border-white/40 text-[#263D5D] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-poppins transition ${
                      currentPage === page
                        ? "bg-[#3ABBD0] text-white"
                        : "bg-white/60 backdrop-blur-xl border border-white/40 text-[#263D5D] hover:bg-white/80"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-xl border border-white/40 text-[#263D5D] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 transition"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out; }
      `}</style>
    </div>
  );
};

export default BrowsePlacePage;
