import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { format } from 'date-fns';

const BookedTask = () => {
  const [bookedTask, setBookedTask] = useState([]);
  const { user } = useContext(AuthContext);
  const { email } = user || {};

  useEffect(() => {
    fetch("http://localhost:5000/bookings")
      .then((res) => res.json())
      .then((data) => {
        const matchedBookedTask = data.filter((task) => task.providerEmail === email);
        if (matchedBookedTask) {
          setBookedTask(matchedBookedTask);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [email]);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary">Booked Tasks</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookedTask.map((task, index) => (
          <div key={index} className="card bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <figure className="w-full h-48 bg-gray-100">
              <img
                src={task.photo}
                alt={`${task.serviceName} task`}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-semibold text-gray-800 mb-4">{task.serviceName}</h2>
              <p className="text-gray-600 mb-2"><strong>User Email:</strong> {task.userEmail}</p>
              <p className="text-gray-600 mb-2"><strong>Category:</strong> {task.category}</p>
              <p className="text-gray-600 mb-2">
                <strong>Date & Time:</strong> {format(new Date(task.date), 'PPPppp')}
              </p>
              <p className="text-gray-600 mb-4"><strong>Price per hour:</strong> ${task.price}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary w-full">Mark as Done</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookedTask;
