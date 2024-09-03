import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import {server_url} from "../../utils/connection.js";

const Review = ({
  serviceName,
  hasBookedService,
  serviceId,
  providerEmail,
  providerPhoto,
  providerName,
  price,
  about,
}) => {
  const [userReview, setUserReview] = useState([]);
  const [bookedUser, setBookedUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { email } = user || {};
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${server_url}/users`)
      .then((res) => res.json())
      .then((data) => {
        setBookedUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [user]);

  useEffect(() => {
    fetch(`${server_url}/reviews/${serviceId}`)
      .then((res) => res.json())
      .then((data) => {
        const reviews = data.filter(
          (review) => review.serviceName === serviceName
        );
        setUserReview(reviews);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [serviceId, serviceName]);

  const handleSubmit = (e) => {
    if (!user) {
      navigate("/login");
      return;
    }
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const review = form.get("review");
    const rating = form.get("rating");

    const userBooked = bookedUser.find((user) => user.email === email);
    if (!userBooked) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User not found",
        confirmButtonText: "OK",
      });
      return;
    }

    const newReview = {
      serviceName,
      serviceId,
      providerEmail,
      userName: userBooked.name,
      userPhoto: userBooked.photo,
      review,
      rating,
      createdDate: new Date().toISOString(),
    };

    fetch(`${server_url}/reviews`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newReview),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserReview([...userReview, newReview]);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Review added successfully",
          confirmButtonText: "Cool",
        });
      });
  };

  return (
    <div className="container mx-auto px-4 md:px-32 mb-16">
      <h3 className="text-3xl font-bold mt-12 mb-6 text-primary">Service Provider</h3>
      <div className="flex items-start bg-gray-100 p-6 rounded-lg shadow-md">
        <img
          className="w-32 h-32 rounded-full object-cover"
          src={providerPhoto}
          alt={providerName}
        />
        <div className="ml-6 flex-1">
          <div className="flex justify-between items-center">
            <h4 className="text-2xl font-bold text-gray-800">{providerName}</h4>
            <p className="text-lg font-semibold text-green-500">${price}/hr</p>
          </div>
          {/* Dynamically showing the total number of reviews */}
          <p className="text-sm text-gray-600 mt-2">({userReview.length} reviews)</p>
          <p className="text-sm text-gray-600 mt-2"> <a href={`mailto:${providerEmail}`} className="text-blue-500 underline">{providerEmail}</a></p>
          <p className="text-sm text-gray-700 mt-4">{about}</p>
        </div>
      </div>

      <h4 className="text-3xl font-bold mt-12 mb-6 text-primary">Add Your Review</h4>
      <div className="card bg-white p-6 rounded-lg shadow-md">
        {hasBookedService ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label font-medium text-gray-700">
                Write your review
              </label>
              <textarea
                name="review"
                className="textarea textarea-primary w-full border-gray-300 rounded-lg p-3"
                placeholder="Share your experience..."
                required
              ></textarea>
            </div>
            <div className="form-control">
              <label className="label font-medium text-gray-700">
                Provide rating (1-5)
              </label>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                required
                placeholder="Rating"
                className="input input-bordered w-full border-gray-300 rounded-lg p-3"
              />
            </div>
            <div className="form-control">
              <button className="btn w-full text-white bg-primary hover:bg-green-600 rounded-lg py-3">
                Submit Review
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-600">You need to book a service to submit a review.</p>
        )}
      </div>

      <h4 className="text-3xl font-bold mt-12 mb-6 text-primary">Customer Reviews</h4>
      {loading ? (
        <p>Loading reviews...</p>
      ) : userReview.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {userReview.map((item, index) => (
            <div key={index} className="card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={item.userPhoto}
                  alt={item.userName}
                />
                <h5 className="ml-4 text-lg font-semibold text-gray-800">{item.userName}</h5>
              </div>
              <span className="text-sm text-gray-500">{new Date(item.createdDate).toLocaleDateString()}</span>
              <p className="text-gray-700 mb-4">{item.review}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-500 font-semibold">Rating: {item.rating} / 5</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No reviews yet.</p>
      )}
    </div>
  );
};

export default Review;
