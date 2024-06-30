import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTitle } from "../../utils/TitleHook";
import axios from "axios";
import { Portfolio } from "../..";
import Loader from "../../components/Loader";
import AccountData from "./AccountData";

export default function AccountPage() {
  const authContext = useAuth();
  const [currentUserPortfolio, setCurrentUserPortfolio] = useState<
    Portfolio | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiUri =
      (import.meta.env.VITE_API_URI as string) +
      "/post/current?author=true&comments=true";
    axios
      .get(apiUri)
      .then((response) => setCurrentUserPortfolio(response.data))
      .finally(() => setIsLoading(false));
  }, []);
  useTitle("Account");
  if (!authContext.isAuthenticated) return <Navigate to="/" />;
  return (
    <main className={"flex flex-col justify-center"}>
      {isLoading ? (
        <Loader />
      ) : (
        <AccountData portfolio={currentUserPortfolio} />
      )}
    </main>
  );
}
