import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

const Login = () => {
  const [logError, setLogError] = useState("");
  const {logInUser, logInWithGoogle} = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");
    if(password.length < 6){
      setLogError("password must be at least 6 characters");
      return;
    }
    logInUser(email, password)
    .then(()=>{
      Swal.fire({
        title: "Login",
        text: "Successfully Login",
        icon: "Success",
        confirmButton:"ok",
      }),
      navigate(location.state? location.state: "/");
    })
    .catch(err => {
      console.error(err);
      setLogError(err.message);
    });
  };
  const handleGoogleLogin = () => {
    logInWithGoogle()
    .then(()=>{
      navigate(location.state? location.state: "/");
    });
  };

  return (
    <div className="hero min-h-screen bg-[#F4F3F0]">
    <div className="hero-content flex-col">
      <div className="text-center">
        <h1 className="text-2xl md:text-5xl font-bold mb-4 text-primary">Login here..</h1>
      </div>
      <div className="w-full lg:w-[600px] shadow-sm bg-base-100 p-10">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="form-control">
            <label className="label">
              <span className="text-base">Email</span>
            </label>
            <input type="email" name="email" required placeholder="email" className="input input-bordered" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="text-base">Password</span>
            </label>
            <input type="password" name="password" required placeholder="password" className="input input-bordered" />
          </div>
          <div className="form-control my-6">
            <button className="btn btn-outline md:text-lg bg-primary hover:bg-[#278f41]">Login</button>
          </div>
        </form>
        {logError && <span className="text-red-400 px-4">{logError}</span>}
          <div className="flex items-center justify-center gap-4 mb-4">
            <h4>Continue with</h4>
            <button onClick={handleGoogleLogin} className="w-6 md:w-8">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWIl8zC8WAMHi5JVmKUb3YVvZd5gvoCdy-NQ&s" alt="" />
            </button>
          </div>
          <div className="label p-5 pt-0">
            <p className="text-secondary">
              New here?
              <Link to="/register" className="text-sm link link-hover">
                {" "}Register
              </Link>
            </p>
          </div>
      </div>
    </div>
  </div>
  )
}

export default Login