import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PopularTasks = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <div className="container mx-auto md:px-32 py-4 bg-white">
      <h2 className="text-4xl font-bold text-center text-primary my-16">
      Popular Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.slice(0, 8).map((service, index) => (
          <Link
            to={`/serviceDetails/${service._id}`}
            key={index}
            className="block bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <figure className="relative pb-9/16">
              <img
                src={service.photo}
                alt={service.serviceName}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {service.serviceName}
              </h2>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-green-500 font-bold">
                Starting at £{service.price}/hr
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularTasks;
