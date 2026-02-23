import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar/Navbar";
import { useAuthContext } from "../store/auth";
import SessionWarningModal from "./auth/SessionWarningModal";

export const UserApp = () => {
  const { isSessionWarningModalOpen, handleRefreshToken, logout } =
    useAuthContext();
  return (
    <>
      <Navbar />
      <div className="container my-1">
        <Outlet />
      </div>
      <SessionWarningModal
        show={isSessionWarningModalOpen}
        onContinue={handleRefreshToken}
        onLogout={logout}
      />
    </>
  );
};
