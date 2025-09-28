import { IoChevronForward } from "react-icons/io5";
import Img from "../../assets/images/background/categories-background.webp";

// Data for the gallery categories
const categories = [
  {
    name: "Single Rooms",
    imageUrl:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16433d?auto=format&fit=crop&q=80",
  },
  {
    name: "Double Rooms",
    imageUrl:
      "https://images.unsplash.com/photo-1560185893-a5536c80e6da?auto=format&fit=crop&q=80",
  },
  {
    name: "Boarding Houses",
    imageUrl:
      "https://images.unsplash.com/photo-1567024769785-53494795b6f2?auto=format&fit=crop&q=80",
  },
  {
    name: "Hostels",
    imageUrl:
      "https://images.unsplash.com/photo-1585298725042-2d8a9a4a7f29?auto=format&fit=crop&q=80",
  },
  {
    name: "Sharing Rooms",
    imageUrl:
      "https://images.unsplash.com/photo-1598605272254-2451f7ec6373?auto=format&fit=crop&q=80",
  },
  {
    name: "Annexes",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
  },
  {
    name: "Houses",
    imageUrl:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2e7?auto=format&fit=crop&q=80",
  },
  {
    name: "Apartments",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80",
  },
  {
    name: "Single Bedrooms",
    imageUrl:
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&q=80",
  },
  {
    name: "Single Bedrooms",
    imageUrl:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80",
  },
];

const CategoriesGallery = () => {
  return (
    <div className="md:p-8 min-h-screen bg-gradient-to-br from-cyan-300 via-blue-200 to-purple-200 relative overflow-hidden">
      {/* Animated background elements from Login3 */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Background Image Overlay from Login3 */}
      <div className="absolute inset-0 z-0">
        <img
          src={Img}
          alt="Architectural background"
          className="object-cover w-full h-full opacity-100"
        />
        <div className="w-full h-full bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 opacity-60"></div>
      </div>

      {/* White gradient overlay for small screens (bottom to top) */}
      <div className="absolute inset-0 z-0 block md:hidden bg-gradient-to-t from-white to-transparent opacity-80"></div>

      {/* Main Content Container with Glass Effect */}
      <div className="relative container mx-auto rounded-[40px] shadow-2xl p-6 sm:p-10 z-10 border border-white/30 animate-fadeInUp">
        {/* Section Title */}
        <h1 className="text-center font-hugiller text-[50px] sm:text-[70px] md:text-[100px] lg:text-[60px] text-[#263D5D] leading-[1.1] mb-10">
          Categories
        </h1>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <a
              href="#"
              key={index}
              className="group relative block rounded-2xl overflow-hidden aspect-[4/3] shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%]">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center shadow-md">
                  <span className="text-[#263D5D] font-semibold text-sm whitespace-nowrap">
                    {category.name}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="relative overflow-hidden inline-flex items-center gap-3 bg-[#263D5D] hover:bg-[#303435] text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group">
            <div className="bg-[#3ABBD0] p-1 rounded-full flex items-center justify-center">
              <IoChevronForward className="text-white h-4 w-4" />
            </div>
            <span className="relative z-10 text-lg">View More</span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>

      {/* Corrected global styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .font-hugiller {
          font-family: "Hugiller", "Playfair Display", serif;
        }
      `}</style>
    </div>
  );
};

export default CategoriesGallery;
