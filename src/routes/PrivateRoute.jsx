import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const PrivateRoute = ({children}) => {
  const {user, loading} = useContext(AuthContext);
    // console.log(user);
    const location = useLocation();

    if(loading) {
        return <div className='flex justify-center items-center'><span className="loading loading-spinner loading-lg"></span></div>
    }
    if(user){
        return children;
    }
    return <Navigate state={location.pathname} to="/login"></Navigate>
}

export default PrivateRoute;