const HowItWorks = () => {
  return (
    <div className="container mx-auto md:px-32 mb-16">
      <h2 className="text-4xl font-bold text-center text-primary my-16">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center p-8 bg-white border border-gray-200 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300">
          <div className="mb-6">
            <img src="https://i.ibb.co/64X6jz0/20824341-6368592.jpg" alt="Sign Up" className="w-24 h-24 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-primary">Sign Up</h3>
          <p className="text-gray-600">
            Create an account to get started. It's quick and easy!
          </p>
        </div>
        <div className="card text-center p-8 bg-white border border-gray-200 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300">
          <div className="mb-6">
            <img
              src="https://i.ibb.co/NYJLMj0/5568528-2915247.jpg"
              alt="Find a Service"
              className="w-24 h-24 mx-auto"
            />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-primary">
            Find a Service
          </h3>
          <p className="text-gray-600">
            Browse through our list of services to find what you need.
          </p>
        </div>
        <div className="card text-center p-8 bg-white border border-gray-200 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300">
          <div className="mb-6">
            <img
              src="https://i.ibb.co/bWBbMqG/8351261-3885914.jpg"
              alt="Book a Service"
              className="w-24 h-24 mx-auto"
            />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-primary">
            Book a Service
          </h3>
          <p className="text-gray-600">
            Schedule and book the service at your convenience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
