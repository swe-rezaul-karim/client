import { Link, Outlet } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import SubNav from "../../components/SubNav/SubNav";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 mt-10">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-block text-primary font-semibold text-lg hover:text-primary-dark transition-colors duration-200"
        >
          &larr; Back to Home
        </Link>
      </div>
      <div className="flex flex-col-reverse md:flex-row md:space-x-8 space-y-6 md:space-y-0">
        <aside className="md:w-1/3 bg-white shadow-lg rounded-lg p-6 md:order-1">
          <ProfileCard />
        </aside>
        <main className="flex-1 bg-white shadow-lg rounded-lg p-6 md:order-2">
          <SubNav />
          <div className="mt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
