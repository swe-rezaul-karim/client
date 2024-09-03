import { useState } from "react";
import Swal from "sweetalert2";
import {server_url} from "../../utils/connection.js";

const AddTask = () => {
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const serviceName = form.get('serviceName');
    const providerName = form.get('providerName');
    const providerEmail = form.get('providerEmail');
    const providerPhoto = form.get('providerPhoto');
    const category = form.get('category');
    const description = form.get('description');
    const photo = form.get('photo');
    const price = form.get('price');
    const availability = form.get('availability');

    const newService = { serviceName, providerName, providerEmail, providerPhoto, category, description, photo, price, availability };

    //send data to server
    fetch(`${server_url}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newService),
    })
      .then((res) => {
        if (res.status === 409) {
          throw new Error("Service already exists");
        }
        return res.json();
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Task is added successfully",
          confirmButtonText: "Cool",
        });
        setError("");
        e.target.reset();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Add Task</h1>
      </div>
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="form-control">
            <label className="label font-semibold">Service Name</label>
            <input
              type="text"
              name="serviceName"
              required
              placeholder="Enter service name"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Provider Name</label>
            <input
              type="text"
              name="providerName"
              required
              placeholder="Enter provider name"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Provider Email</label>
            <input
              type="email"
              name="providerEmail"
              required
              placeholder="Enter provider email"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Provider Photo URL</label>
            <input
              type="url"
              name="providerPhoto"
              required
              placeholder="Enter provider photo URL"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Category</label>
            <input
              type="text"
              name="category"
              required
              placeholder="Enter category"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Description</label>
            <textarea
              name="description"
              required
              placeholder="Describe the service"
              className="textarea textarea-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Price</label>
            <input
              type="number"
              name="price"
              required
              placeholder="Enter price"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Availability</label>
            <select
              name="availability"
              required
              className="select select-bordered w-full"
            >
              <option disabled selected>
                Select availability
              </option>
              <option>Available</option>
              <option>Unavailable</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="form-control">
            <button className="btn btn-primary w-full">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
