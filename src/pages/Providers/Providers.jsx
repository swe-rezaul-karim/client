import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import {server_url} from "../../utils/connection.js";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetching the provider data from the API
    fetch(`${server_url}/tasks`)
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredProviders = providers.filter((provider) => {
    const nameMatch =
      provider.providerName &&
      provider.providerName.toLowerCase().includes(searchQuery);

    const serviceMatch =
      provider.serviceName &&
      provider.serviceName.toLowerCase().includes(searchQuery);

    return nameMatch || serviceMatch;
  });

  return (
    <div className="container mx-auto md:px-32 py-4 bg-white">
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search providers by name or service..."
          className="w-full p-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={searchQuery}
          onChange={handleSearch}
        />
        <FaSearch className="absolute right-4 top-4 text-gray-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <div
              key={provider._id}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <figure className="h-48 overflow-hidden">
                {provider.providerPhoto ? (
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    src={provider.providerPhoto}
                    alt={provider.providerName}
                  />
                ) : (
                  <div className="flex justify-center items-center h-full bg-gray-200">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </figure>
              <div className="p-6">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-green-600 text-white text-xs px-3 py-1 rounded-full uppercase shadow-md">
                  {provider.category}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {provider.providerName}
                </h2>
                <p className="text-xl font-bold text-gray-600 mb-4">{provider.providerEmail}</p>
                <p className="text-gray-600 mb-4"><span className="font-bold">Service Details:</span>{provider.description}</p>
                <hr className="border-gray-200 mb-4" />
                <div className="space-y-2">
                  <div className="text-lg text-tomato">
                    Service: {provider.serviceName}
                  </div>
                  <div className="text-lg text-gray-700">
                    Price: <span className="font-bold">${provider.price}</span>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      provider.availability === "Available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {provider.availability}
                  </div>
                  <Link
                    to="/messages"
                    state={{
                      providerName: provider.providerName,
                      providerPhoto: provider.providerPhoto,
                      providerEmail: provider.providerEmail,
                    }}
                    className="block mt-4 text-lg btn bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 text-center transition duration-300 shadow-md"
                  >
                    Message
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No providers found</p>
        )}
      </div>
    </div>
  );
};

export default Providers;
