import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";

interface AuthProps {
  logout: () => void;
}

function AuthProfileDropdown({ logout }: AuthProps) {
  const logoutHandler = () => {
    Swal.fire({
      title: "Sign out",
      text: "Are you sure you want to sign out?",
      confirmButtonColor: "#ef4444",
      showCancelButton: true,
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        window.location.reload();
      }
    });
  };
  return (
    <>
      <Link
        to="/account"
        className="px-4 py-2 hover:bg-red-600 transition-all w-32 flex items-center gap-2 rounded-t-lg"
      >
        <span className="fa-solid fa-user"></span>
        Account
      </Link>
      <button
        className="px-4 py-2 hover:bg-red-600 transition-all w-32 flex items-center gap-2 rounded-b-lg"
        onClick={() => logoutHandler()}
      >
        <span className="fa-solid fa-x"></span>
        Sign out
      </button>
    </>
  );
}

function UnauthProfileDropdown() {
  return (
    <Link
      to="/login"
      className="px-4 py-2 hover:bg-red-600 transition-all w-32 flex items-center gap-2 rounded-t-lg rounded-b-lg"
    >
      <span className="fa-solid fa-right-from-bracket"></span>
      Sign-In
    </Link>
  );
}

export default function Navbar() {
  const [dropdownIsFocus, setDropdownFocus] = useState(false);
  const authContext = useAuth();
  return (
    <nav className="bg-black text-white w-full p-4 flex justify-between items-center">
      <h1 className="text-2xl">
        <Link className="hover:text-neutral-200 transition-all" to="/">
          <span className="fa-solid fa-code -rotate-45 text-red-500"></span>{" "}
          Judge My Portfolio
        </Link>
      </h1>
      <div
        id="currentUserProfilePic"
        className="relative block"
        onMouseEnter={() => {
          setDropdownFocus(true);
        }}
        onMouseLeave={() => {
          setDropdownFocus(false);
        }}
      >
        <button className="rounded-full transition-all">
          <img
            src={authContext.account?.imageUrl || "/pfp_placeholder.jpg"}
            alt="your profile pic"
            width={60}
            className="rounded-full transition-all cursor-pointer overflow-hidden"
          />
        </button>
        {dropdownIsFocus ? (
          <div
            className="bg-red-500 rounded-lg flex flex-col shadow-lg absolute right-0"
            onMouseEnter={() => setDropdownFocus(true)}
          >
            {authContext.isAuthenticated ? (
              <AuthProfileDropdown logout={authContext.logout} />
            ) : (
              <UnauthProfileDropdown />
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
}
