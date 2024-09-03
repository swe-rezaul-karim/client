import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const MyService = () => {
  const [services, setServices] = useState([]);
  const { user } = useContext(AuthContext);
  const { email } = user || {};

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => {
        const matchedService = data.filter(
          (service) => service.providerEmail === email
        );
        if (matchedService) {
          setServices(matchedService);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [email]);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">My Provided Services </h1>
        <p className="text-gray-600">Manage and update your provided services</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div key={index} className="card bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-semibold mb-2">{service.serviceName}</h2>
              <p className="text-gray-700 mb-2"><strong>Category:</strong> {service.category}</p>
              <p className="text-gray-700 mb-2"><strong>Price:</strong> ${service.price}/hr</p>
              <p className="text-gray-700 mb-4">{service.description}</p>
              <p className="text-gray-700 mb-4"><strong>Availability:</strong> {service.availability}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary w-full">Edit Service</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyService;
