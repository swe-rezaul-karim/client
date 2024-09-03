import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProvider";
import {server_url} from "../../utils/connection.js";

const Register = () => {
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("normal");
  const [categories, setCategories] = useState([]);
  const { createUser,user } = useContext(AuthContext);
  const navigate = useNavigate();

  //fetch category
  useEffect(() => {
    fetch(`${server_url}/services`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCategories(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const password = form.get("password");
    const role = userType === "professional" ? "professional" : "user";
    form.append("role", role);


    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Invalid password. Password must be at least 6 characters long and contain at least one capital letter and one special character."
      );
      return;
    }

    //send data to server
    fetch(`${server_url}/users`, {
      method: "POST",
      body: form,
    })
      .then((res) => {
        if (res.status === 409) {
          throw new Error("User already exists");
        }
        return res.json();
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User is added successfully",
          confirmButtonText: "Cool",
        });
        setError("");
        createUser(form.get("email"), password)
          .then(() => {
            Swal.fire({
              title: "Register",
              text: "Successfully Registered",
              icon: "Success",
              confirmButtonText: "ok",
            });
            navigate("/login");
          })
          .catch((err) => {
            console.error(err);
            setError(err.message);
          });
        e.target.reset();
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
        });
      });
  };
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-2xl md:text-5xl font-bold mt-20 mb-4 text-primary">
            Register now!
          </h1>
          <div className="form-control">
            <div className="flex">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="normal"
                  checked={userType === "normal"}
                  onChange={() => setUserType("normal")}
                  className="radio radio-primary"
                />
                <label className="label cursor-pointer">
                  <span className="label-text text-lg text-[#E91E63] me-2">
                    Normal User
                  </span>
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="professional"
                  checked={userType === "professional"}
                  onChange={() => setUserType("professional")}
                  className="radio radio-primary"
                />
                <label className="label cursor-pointer">
                  <span className="label-text text-lg text-[#E91E63] ml-2">
                    Professional
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="card flex-shrink-0 w-full  lg:w-[600px] shadow-2xl bg-base-100 mb-10">
          <form onSubmit={handleSubmit} className="card-body w-full">
            <div className="form-control">
              <label className="label">
                <span className="text-base">Name</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="name"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-base">Email</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="email"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-base">Photo url</span>
              </label>
              <input
                type="text"
                name="photo"
                required
                placeholder="photo url"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-base">Address</span>
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="address"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-base">Post Code</span>
              </label>
              <input
                type="text"
                name="postcode"
                required
                placeholder="postcode"
                className="input input-bordered"
              />
            </div>

            {userType === "professional" && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="text-base">Area</span>
                  </label>
                  <input
                    type="text"
                    name="area"
                    required
                    placeholder="area"
                    defaultValue="Bedford"
                    className="input input-bordered"
                  />
                </div>

                <select
                  name="category"
                  className="select select-accent w-full mt-4"
                  defaultValue=""
                >
                  <option disabled value="">
                    Select Category
                  </option>
                  {[...new Set(categories.map(cat=>cat.category))].map((category, idx) => (
                    <option className="text-black" key={idx} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <div className="form-control">
                  <label className="label">
                    <span className="text-base">Identity Document</span>
                  </label>
                  <input
                    type="file"
                    name="identity"
                    required
                    placeholder="identity document"
                    className="input input-bordered"
                  />
                </div>
              </>
            )}

            <div className="form-control">
              <label className="label">
                <span className="text-base">Phone</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="phone"
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-base">Password</span>
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="password"
                className="input input-bordered"
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-primary hover:bg-[#278f41]">
                Register
              </button>
            </div>
          </form>
          {error && <span className="text-red-400 px-4">{error}</span>}

          <div className="label p-5 pt-0">
            <p className="text-secondary my-2">
              {user?"":<>
              <span>Already have an account?"</span>
              <Link to="/login" className="text-sm link link-hover mb-4">
                {" "}
                Login
              </Link>
              </>
              }
            </p>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
