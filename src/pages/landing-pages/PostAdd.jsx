import React from "react";
import BackIMg from "../../assets//images/background/post-back.webp";
import Man1 from "../../assets/images/others/Img-6.webp";
import { FaChevronRight } from "react-icons/fa";
const PostAdd = () => {
  const handleAddPost = () => {
    // Navigate to /post-add route
    window.location.href = "/post-add";
  };

  return (
    <div
      className="h-screen relative overflow-hidden bg-cover bg-center py-20"
      style={{ backgroundImage: `url(${BackIMg})` }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 "></div>
      <div className="relative z-10 container mx-auto px-4 ">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 min-h-screen lg:min-h-0">
          {/* Left side - Image section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative max-w-md lg:max-w-lg xl:max-w-xl">
              {/* Main businessman image placeholder */}
              <div className="relative">
                <img
                  src={Man1}
                  alt="Professional businessman"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right side - Content section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2">
            <div className="max-w-md lg:max-w-lg xl:max-w-xl mx-auto lg:mx-0">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-8">
                <span className="text-slate-800">Post Your </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500 ">
                  Add
                </span>
              </h1>

              <p className="text-slate-600 text-base text-1xl mb-8 lg:mb-12 leading-relaxed rounded-2xl bg-white/80 p-5">
                Discover the smarter way to rent – effortlessly list your
                boarding rooms, houses, hostels, or luxury apartments on our
                all-in-one platform. We bridge the gap between property owners
                and tenants, making your rental journey seamless from start to
                finish. Whether you're renting out that spare room or that
                dreamed mansion, we make connecting simple. Post, click, browse,
                done.
              </p>

              <button
                onClick={handleAddPost}
                className="flex justify-end mt-12  "
                aria-label="Add Post"
              >
                <div className="relative overflow-hidden flex items-center gap-2 bg-[#263D5D] hover:bg-[#303435] text-white rounded-2xl px-4 py-2 shadow-lg border border-white/20 hover:scale-105 transition group ">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-400 text-black">
                    <FaChevronRight />
                  </span>
                  <span className="font-semibold tracking-wide font-poppins">
                    Add Post
                  </span>
                  <div className="absolute inset-0 rounded-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </button>

              {/* Decorative elements */}
              <div className="hidden lg:block absolute -z-10 top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-200 to-teal-200 rounded-full blur-3xl opacity-30"></div>
              <div className="hidden lg:block absolute -z-10 bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-2xl opacity-40"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 lg:h-32 bg-gradient-to-r from-cyan-100 via-teal-100 to-blue-100 opacity-50 transform skew-y-1"></div>
    </div>
  );
};

export default PostAdd;
