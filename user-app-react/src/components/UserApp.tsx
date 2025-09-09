import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar/Navbar";

export const UserApp = () => {
  return (
    <>
      <Navbar />
      <div className="container my-4">
        <Outlet />
      </div>
    </>
  );
};
