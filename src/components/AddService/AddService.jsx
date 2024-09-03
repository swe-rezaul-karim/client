import { useState } from "react";
import Swal from "sweetalert2";

const AddService = () => {
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        const serviceName = form.get('serviceName');
        const  photo =form.get('photo');
        const  category =form.get('category');
        const  description =form.get('description');
        const  price =form.get('price');

        const newService = {serviceName,category,description,photo,price};

        //send data to server
        fetch("http://localhost:5000/services", {
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
      };
  return (
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mt-20 mb-4 text-primary">
            Add Service
          </h1>
        </div>
        <div className="card flex-shrink-0 w-full  lg:w-[600px] shadow-2xl bg-base-100 mb-10">
          <form onSubmit={handleSubmit} className="card-body w-full">
            <div className="form-control">
              <label className="label">
                <span className="text-base">Service Name</span>
              </label>
              <input
                type="text"
                name="serviceName"
                required
                placeholder="service name"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-base">Service Photo url</span>
              </label>
              <input
                type="text"
                name="photo"
                required
                placeholder="service photo"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-base">Category</span>
              </label>
              <input
                type="text"
                name="category"
                required
                placeholder="category"
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="text-base">Description</span>
              </label>
              <input
                type="text"
                name="description"
                required
                placeholder="description"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-base">Price</span>
              </label>
              <input
                type="text"
                name="price"
                required
                placeholder="minimum price per hour"
                className="input input-bordered"
              />
            </div>

            <div className="form-control mt-6">
              <button className="btn bg-primary hover:bg-[#278f41]">
                Add
              </button>
            </div>
          </form>
          {error && <span className="text-red-400 px-4">{error}</span>}
        </div>
      </div>
  )
}

export default AddService;