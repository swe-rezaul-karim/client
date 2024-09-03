import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import ProfileCard from "../ProfileCard/ProfileCard";
import SubNav from "../SubNav/SubNav";

const UserProfile = () => {
  const { providerEmail } = useParams();
  const [providerData, setProviderData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/users?email=${providerEmail}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProviderData(data[0]); // Assuming email is unique and fetch returns a single user
      })
      .catch((err) => {
        console.error("Error fetching provider data:", err);
      });
  }, [providerEmail]);

  if (!providerData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto md:px-32 mt-10">
      <h2 className="text-4xl font-bold text-center text-primary mb-6">Provider Profile</h2>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="order-2 md:order-1 md:w-1/3">
          <ProfileCard  providerData={providerData}/>
        </div>
        <div className="order-1 md:order-2">
          <SubNav />
          <Outlet />
        </div>
      </div>
      {/* <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="order-2 md:order-1 md:w-1/3"> */}
          {/* Display provider profile card */}
          {/* <div className="p-4 bg-white shadow-lg rounded-lg">
            <img
              className="w-40 h-40 rounded-full mx-auto"
              src={providerData.photo}
              alt={providerData.name}
            /> */}
            {/* <h3 className="text-xl font-bold text-center mt-4">{providerData.name}</h3>
            <p className="text-gray-600 text-center">{providerData.email}</p> */}
            {/* Add more profile details as needed */}
          {/* </div>
        </div>
        <div className="order-1 md:order-2"> */}
          {/* Add navigation or additional content for the profile */}
          {/* Example: SubNav or additional components */}
        {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default UserProfile;
