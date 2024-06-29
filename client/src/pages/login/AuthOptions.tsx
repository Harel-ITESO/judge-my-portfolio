import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTitle } from "../../utils/TitleHook";

export default function AuthOptions() {
  const apiUri = import.meta.env.VITE_API_URI as string;
  const googleAuthUri = apiUri + "/auth/google";
  const ghAuthUri = apiUri + "/auth/github";
  const authContext = useAuth();
  useTitle("Auth Options");
  if (authContext.isAuthenticated) return <Navigate to="/login/message" />;
  return (
    <>
      <header className="bg-black">
        <h1 className="text-lg m-3 text-white">
          <Link className="hover:text-neutral-200 transition-all" to="/">
            <span className="fa-solid fa-code -rotate-45 text-red-500"></span>{" "}
            Judge My Portfolio
          </Link>
        </h1>
      </header>
      <main className="flex items-center justify-center bg-black text-white flex-col p-10">
        <h2>
          <span className="italic text-red-500">Authenticate</span> with your
          favorite service
        </h2>
        <div className="flex justify-between w-1/4 mt-8">
          <a href={googleAuthUri}>
            <div className="flex flex-col items-center gap-6 opacity-30 hover:opacity-100 transition-all hover:-translate-y-1 cursor-pointer">
              <div className="p-3 bg-white rounded-full ">
                <img
                  src="/google_logo.png"
                  alt="google logo"
                  className="w-10"
                />
              </div>
              <span className="opacity-50">Join with Google</span>
            </div>
          </a>
          <a href={ghAuthUri}>
            <div className="flex flex-col items-center gap-6 opacity-30 hover:opacity-100 transition-all hover:-translate-y-1 cursor-pointer">
              <div className="p-3 bg-white rounded-full ">
                <img
                  src="/github_logo.png"
                  alt="google logo"
                  className="w-10"
                />
              </div>
              <span className="opacity-50">Join with Github</span>
            </div>
          </a>
        </div>
      </main>
    </>
  );
}
