import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTitle } from "../../utils/TitleHook";

export default function AccountPage() {
  const authContext = useAuth();
  useTitle("Account");
  if (!authContext.isAuthenticated) return <Navigate to="/" />;
  return (
    <main className={"flex flex-col justify-center"}>
      <>
        <div className="flex flex-col items-center mt-3">
          <img
            src={authContext.account?.imageUrl}
            alt=""
            className="rounded-full w-44"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-center mt-4 text-lg">
            {authContext.account?.username}
          </h2>
        </div>
        <span className="mt-32 text-center italic">
          Hmm... You still haven't posted something yet.{" "}
          <Link to="#" className="text-red-500 underline hover:text-red-600">
            Post your portfolio here!
          </Link>
        </span>
      </>
    </main>
  );
}
