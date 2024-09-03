import {
    createBrowserRouter,
  } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Service from "../pages/Service/Service";
import Forum from "../pages/Forum/Forum";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import ServiceDetails from "../pages/ServiceDetails/ServiceDetails";
import AboutProfile from "../components/AboutProfile/AboutProfile";
import BookedTask from "../components/BookedTask/BookedTask";
import MyReviews from "../components/MyReviews/MyReviews";
import AddTask from "../components/AddTask/AddTask";
import AddService from "../components/AddService/AddService";
import MyService from "../components/MyService/MyService";
import IdentityCheck from "../components/IdentityCheck/IdentityCheck";
import MyBooking from "../components/MyBooking/MyBooking";
import Messenger from "../pages/Messenger/Messenger";
import PrivateRoute from "./PrivateRoute";
import Providers from "../pages/Providers/Providers";


const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/service",
          element: <Service/>
        },
        {
          path: "/serviceDetails/:id",
          element: <ServiceDetails/>
        },
        {
          path: "/provider",
          element: <Providers/>
        },
        {
          path: "/forum",
          element: <PrivateRoute><Forum/></PrivateRoute>
        },
        {
          path: "/messages",
          element: <PrivateRoute> <Messenger /> </PrivateRoute>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        
      ],
    },
    {
      path: "profile",
      element: <Profile/>,
      children:[
        {
          path: "",
          element: <AboutProfile/>
        },
        {
          path: "aboutProfile",
          element: <AboutProfile/>
        },
        {
          path: "myReviews",
          element: <MyReviews/>
        },
        {
          path: "addTask",
          element: <AddTask/>
        },
        {
          path: "myService",
          element: <MyService/>
        },
        {
          path: "bookedTask",
          element: <BookedTask/>
        },
        {
          path: "myBooking",
          element: <MyBooking/>
        },
        {
          path: "addService",
          element: <AddService/>
        },
        {
          path: "identityCheck",
          element: <IdentityCheck/>
        },
      ],
    },
  ]);
  export default router;
