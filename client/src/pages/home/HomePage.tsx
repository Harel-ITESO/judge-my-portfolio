import { useEffect, useState } from "react";
import HomeContent from "./HomeContent";
import { Portfolio } from "../..";
import axios from "axios";
import Loader from "../../components/Loader";
import { useTitle } from "../../utils/TitleHook";
import OrderByInput from "./OrderByInput";

export default function HomePage() {
  const [portfolios, setPorftolios] = useState<Portfolio[]>();
  const [hasFetched, setHasFetched] = useState(false);
  const [orderType, setOrderType] = useState<string>();

  const handleOrderTypeChange = (type: string) => {
    setHasFetched(false);
    setOrderType(type);
  };

  useTitle("Home");
  useEffect(() => {
    const apiUri =
      import.meta.env.VITE_API_URI +
      `/post/all/?author=true&comments=true&orderType=${orderType || "1"}`;
    axios
      .get(apiUri)
      .then((response) => {
        setPorftolios(response.data);
      })
      .finally(() => setHasFetched(true));
  }, [orderType]);
  return (
    <main>
      <div className="xl:px-44 px-32 pt-10">
        <OrderByInput orderChangeHandler={handleOrderTypeChange} />
      </div>
      <div
        className={!hasFetched ? "flex items-center justify-center h-full" : ""}
      >
        {!hasFetched ? <Loader /> : <HomeContent portfolios={portfolios} />}
      </div>
    </main>
  );
}
