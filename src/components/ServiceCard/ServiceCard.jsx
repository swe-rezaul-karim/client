import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ServiceCard = () => {
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...new Set(services.map(serv => serv.category))].map((category, index) => {
          const service = services.find((service) => service.category === category);
          return (
            <div key={index} className="relative bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-lg">
              <figure className="h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={service.photo}
                  alt={service.category}
                />
              </figure>
              <div className="p-6">
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full uppercase">{service.category}</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{service.category}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <hr className="border-gray-200 mb-4"/>
                <div className="space-y-2">
                  {services.filter(s => s.category === category).map((service, index) => (
                    <Link 
                      key={index} 
                      to={`/serviceDetails/${service._id}`} 
                      className="block text-lg text-tomato hover:text-red-600 transition duration-300"
                    >
                      {service.serviceName}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCard;
