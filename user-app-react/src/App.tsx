import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar/Navbar";
import { useAuthContext } from "./store/auth";

function App() {
  const { user } = useAuthContext();
  return (
    <>
      <Navbar />
      <Outlet key={user?._id} />
    </>
  );
}

export default App;
