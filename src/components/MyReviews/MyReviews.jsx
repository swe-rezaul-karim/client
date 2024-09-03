import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import {server_url} from "../../utils/connection.js";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const { email } = user || {};

  useEffect(() => {
    fetch(`${server_url}/reviews`)
      .then((res) => res.json())
      .then((data) => {
        const matchedReview = data.filter((review) => review.providerEmail === email);
        if (matchedReview) {
          setReviews(matchedReview);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [email]);

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary">My Reviews</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <div key={index} className="card bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <figure className="w-full h-48 bg-gray-100 flex justify-center items-center">
              <img
                className="object-cover h-32 w-32 rounded-full border-2 border-gray-300"
                src={review.userPhoto}
                alt={`${review.userName} profile`}
              />
            </figure>
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-semibold text-gray-800 mb-2">{review.userName}</h2>
              <p className="text-gray-600 mb-2"><strong>Service Name:</strong> {review.serviceName}</p>
              <p className="text-gray-600 mb-2"><strong>Review:</strong> {review.review}</p>
              <p className="text-gray-600 mb-4"><strong>Rating:</strong> {review.rating} / 5</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary w-full">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReviews;
