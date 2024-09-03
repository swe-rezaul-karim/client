import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import Review from "../../components/Review/Review";
import {server_url} from "../../utils/connection.js";

const ServiceDetails = () => {
  const [tasks, setTasks] = useState([]);
  const [service, setService] = useState([]);
  const [hasBookedService, setHasBookedService] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useContext(AuthContext);
  const { email } = user || {};
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`${server_url}/services/${id}`)
      .then((res) => res.json())
      .then((data) => setService(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);


  useEffect(() => {
    fetch(`${server_url}/tasks`)
      .then((res) => res.json())
      .then((data) => {
        const matchedTask = data.filter((task) => task.serviceName === service.serviceName);
        setTasks(matchedTask.length > 0 ? matchedTask : []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTasks([]);
      });
  }, [id, service.serviceName]);

  useEffect(() => {
    fetch(`${server_url}/bookings`)
      .then((res) => res.json())
      .then((data) => {
        const bookings = data.filter(
          (booking) => booking.serviceId === id && booking.userEmail === email
        );
        const bookedProviders = bookings.reduce((acc, booking) => {
          acc[booking.providerEmail] = true;
          return acc;
        }, {});
        setHasBookedService(bookedProviders);
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [id, email]);

  const handleBookService = (provider) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (selectedDate < new Date()) {
      Swal.fire("Invalid Date", "Please select a future date.", "error");
      return;
    }

    const bookingData = {
      userEmail: email,
      date: selectedDate.toISOString(),
      serviceName: service.serviceName,
      serviceId: id,
      category: service.category,
      providerName: provider.providerName,
      providerEmail: provider.providerEmail,
      photo: service.photo,
      price: provider.price,
      booked: true,
    };

    fetch(`${server_url}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then(() => {
        setHasBookedService((prev) => ({ ...prev, [provider.providerEmail]: true }));
        Swal.fire("Success", "Service booked successfully!", "success");
      })
      .catch((error) => {
        Swal.fire("Error", "An error occurred while booking the service.", "error");
        console.error("Error booking service:", error);
      });
  };

  const handleProfileReviewClick = (provider) => {
    setSelectedProvider(provider);
    document.getElementById("my_modal_4").showModal();
  };

  return (
    <div className="container mx-auto px-4 md:px-32 bg-gray-50 py-8">
      <h2 className="text-4xl font-extrabold text-center text-green-600 mb-16 mt-6">
        Service Details
      </h2>
      <div className="bg-white shadow-lg rounded-xl mb-16 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 w-full md:w-1/2 flex justify-center">
            <img
              className="rounded-lg w-full max-w-sm object-cover"
              src={service.photo}
              alt={service.serviceName}
            />
          </div>
          <div className="p-8 md:w-1/2">
            <h3 className="text-3xl font-semibold mb-4">Service Name: {service.serviceName}</h3>
            <p className="text-lg text-gray-600 mb-2">Category: {service.category}</p>
            <p className="text-gray-800">{service.description}</p>
          </div>
        </div>
      </div>
      <div className="mb-12">
        <h3 className="text-4xl font-bold text-center text-green-600 mb-10">
          Service Providers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task, idx) => (
            <div
              key={idx}
              className="card bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105"
            >
              <div className="flex p-6">
                <div className="w-1/3 flex flex-col items-center">
                  <img
                    className="w-32 h-32 rounded-full object-cover mb-4"
                    src={task.providerPhoto}
                    alt={task.providerName}
                  />
                  <button
                    className="btn text-white bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2"
                    onClick={() => handleProfileReviewClick(task)}
                  >
                    Profile & Review
                  </button>
                </div>
                <div className="ml-6 w-2/3">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-semibold">{task.providerName}</p>
                    <p className="text-lg text-green-600 font-bold">${task.price}/hr</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Availability: {task.availability}</p>
                  <p className="text-sm text-gray-700 mb-4"><a href={`mailto:${task.providerEmail}`} className="text-blue-500 underline">{task.providerEmail}</a></p>
                  <div className="mb-4">
                    <p className="text-lg text-green-600 mb-2">
                      Choose your date and time:
                    </p>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      showTimeSelect
                      dateFormat="Pp"
                      minDate={new Date()}
                      className="border rounded-lg p-2 w-full"
                    />
                  </div>
                  <p className="text-lg font-semibold mb-2">How I can help:</p>
                  <p className="text-gray-700 mb-6">{task.description}</p>
                  <div className="flex gap-4">
                    <Link
                      to="/messages"
                      state={{
                        providerName: task.providerName,
                        providerPhoto: task.providerPhoto,
                        providerEmail: task.providerEmail,
                      }}
                      className="btn bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                    >
                      Message
                    </Link>
                    <button
                      onClick={() => handleBookService(task)}
                      className={
                        hasBookedService[task.providerEmail]
                          ? "btn bg-gray-300 text-gray-500 rounded-lg px-6 py-2 cursor-not-allowed"
                          : "btn bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                      }
                    >
                      {hasBookedService[task.providerEmail] ? "Booked" : "Book"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Improved Responsive Modal */}
      <dialog id="my_modal_4" className="modal">
          <div className="modal-box md:w-11/12 max-w-4xl">
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">X</button>
              </form>
            </div>
            <div>
              {selectedProvider && (
                <Review
                  providerPhoto={selectedProvider.providerPhoto}
                  providerName={selectedProvider.providerName}
                  providerEmail={selectedProvider.providerEmail}
                  serviceName={selectedProvider.serviceName}
                  price={selectedProvider.price}
                  about={selectedProvider.about}
                  serviceId={id}
                  hasBookedService={hasBookedService}
                />
              )}
            </div>
          </div>
        </dialog>
    </div>
  );
};

export default ServiceDetails;
