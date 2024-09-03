import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { format } from 'date-fns';
import {server_url} from "../../utils/connection.js";

const MyBooking = () => {
  const [booking, setBooking] = useState([]);
  const { user } = useContext(AuthContext);
  const { email } = user || {};

  useEffect(() => {
    fetch(`${server_url}/bookings`)
      .then((res) => res.json())
      .then((data) => {
        const matchedBooking = data.filter((task) => task.userEmail === email);
        if (matchedBooking) {
          setBooking(matchedBooking);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [email]);

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-primary">My Bookings</h1>
        <p className="text-gray-500 mt-2">Manage your upcoming bookings and stay on top of your schedule</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {booking.map((task, index) => (
          <div key={index} className="card bg-white shadow-md rounded-lg transition-transform transform hover:scale-105">
            <figure className="w-full h-48 bg-gray-100">
              <img
                src={task.photo}
                alt={`${task.serviceName} image`}
                className="w-full h-full object-cover rounded-t-lg"
              />
            </figure>
            <div className="card-body p-6">
              <h2 className="card-title text-2xl font-semibold text-gray-800 mb-4">{task.serviceName}</h2>
              <p className="text-gray-600 mb-2"><strong>Provider:</strong> {task.providerEmail}</p>
              <p className="text-gray-600 mb-2"><strong>Category:</strong> {task.category}</p>
              <p className="text-gray-600 mb-2"><strong>Date & Time:</strong> {format(new Date(task.time ? task.time : task.date), 'PPPppp')}</p>
              <p className="text-gray-600 mb-4"><strong>Price per hour:</strong> ${task.price}</p>
              <div className="card-actions">
                <button className="btn btn-primary w-full">Mark as Done</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooking;
