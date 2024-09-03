import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div>
      <div
        className="hero min-h-96 md:h-[500px] relative"
        style={{
          backgroundImage: "url(https://i.ibb.co/R218DgC/serviceaggrement.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay bg-black bg-opacity-60 absolute inset-0"></div>
        <div className="hero-content relative z-1 text-center text-white">
          <div className="max-w-lg mx-auto">
            <h1 className="font-extrabold text-2xl md:text-4xl mb-4 leading-tight">
              Connecting You with Local Services Made Easy
            </h1>
            <p className="mb-6 text-lg md:text-xl">
              Find, book, and manage local services with real-time support and
              community engagement.
            </p>
            <div className="hero-buttons flex justify-center space-x-4">
              <Link to="/service" className="bg-green-500 hover:bg-[#278f41] text-white py-3 px-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
                Get Started
              </Link>
              <button className="bg-blue-500 hover:bg-[#3975d5] text-white py-3 px-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
