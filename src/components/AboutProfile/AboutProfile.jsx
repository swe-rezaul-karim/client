import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { server_url } from "../../utils/connection.js";

const AboutProfile = () => {
  const [userData, setUserData] = useState([]);
  const { user } = useContext(AuthContext);
  const modalRef = useRef(null);

  useEffect(() => {
    if (user && user.email) {
      fetch(`${server_url}/users`)
        .then((res) => res.json())
        .then((data) => {
          const matchedUser = data.find(
            (userData) => userData.email === user.email
          );
          if (matchedUser) {
            setUserData(matchedUser);
          }
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      name: formData.get("name"),
      about: formData.get("about"),
      address: formData.get("address"),
      postcode: formData.get("postcode"),
      phone: formData.get("phone"),
    };

    fetch(`${server_url}/users/${userData._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Profile updated successfully",
            confirmButtonText: "Cool",
          });
          modalRef.current.close();
        }
      });
  };

  return (
    <div className="bg-white shadow-md rounded-lg mt-16 p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-2">{userData.name}</h2>
          <h4 className="text-lg text-gray-600 mb-2">About Yourself/Business:</h4>
          <p className="mb-4">{userData.about || "No details available"}</p>
          <p className="mb-4">
            <strong className="text-gray-700">Address:</strong> {userData.address || "N/A"}
          </p>
          <p className="mb-4">
            <strong className="text-gray-700">Postcode:</strong> {userData.postcode || "N/A"}
          </p>
          <p className="mb-4">
            <strong className="text-gray-700">Phone:</strong> {userData.phone || "N/A"}
          </p>
        </div>
        <button
          onClick={() => modalRef.current.showModal()}
          className="btn btn-outline btn-primary"
          aria-label="Edit Profile"
        >
          <FaEdit />
        </button>
      </div>

      <dialog ref={modalRef} id="my_modal_1" className="modal">
        <form onSubmit={handleSubmit} className="modal-box rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

          <div className="form-control mb-4">
            <label className="label">
              <span className="text-base">Name</span>
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={userData.name}
              placeholder="Enter your name"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="text-base">About</span>
            </label>
            <textarea
              name="about"
              className="textarea textarea-bordered w-full"
              placeholder="About yourself/business"
              defaultValue={userData.about}
            ></textarea>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="text-base">Address</span>
            </label>
            <input
              type="text"
              name="address"
              required
              defaultValue={userData.address}
              placeholder="Enter your address"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="text-base">Postcode</span>
            </label>
            <input
              type="text"
              name="postcode"
              required
              defaultValue={userData.postcode}
              placeholder="Enter your postcode"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control mb-6">
            <label className="label">
              <span className="text-base">Phone</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              defaultValue={userData.phone}
              placeholder="Enter your phone number"
              className="input input-bordered w-full"
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => modalRef.current.close()}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default AboutProfile;
