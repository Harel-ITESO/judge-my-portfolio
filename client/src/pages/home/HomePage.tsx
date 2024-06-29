import { useEffect, useState } from "react";
import HomeContent from "./HomeContent";
import { PortfolioCardPost } from "../..";
import axios from "axios";
import Loader from "../../components/Loader";
import { useTitle } from "../../utils/TitleHook";

// const mockPortfolios = [
//   {
//     title: "Web developer portfolio",
//     username: "Miguel Rodríguez",
//     starAverage: 4.5,
//     thumbnailImage:
//       "https://repository-images.githubusercontent.com/384091706/a1614500-e03f-11eb-986a-30f6f0d4f1cc",
//     viewCount: 10,
//     commentCount: 3,
//   },
//   {
//     title: "my web dev portfolio",
//     username: "José González",
//     starAverage: 3.4,
//     thumbnailImage:
//       "https://miro.medium.com/v2/resize:fit:1123/1*6C702o6cpNyLm27WLdZyjg.png",
//     viewCount: 2,
//     commentCount: 0,
//   },
//   {
//     title: "my web dev portfolio",
//     username: "José González",
//     starAverage: 3.4,
//     thumbnailImage:
//       "https://media.licdn.com/dms/image/D5612AQEqrH2rMY7GRw/article-cover_image-shrink_720_1280/0/1679600688291?e=2147483647&v=beta&t=HsP6TRdUpG54xiyaihtDSPXt6Gilw9CcLE4VpBij6g4",
//     viewCount: 2,
//     commentCount: 0,
//   },
// ];

export default function HomePage() {
  const [portfolios, setPorftolios] = useState<PortfolioCardPost[]>();
  const [hasFetched, setHasFetched] = useState(false);
  useTitle("Home");
  useEffect(() => {
    const apiUri =
      import.meta.env.VITE_API_URI + "/post/all?author=true&comments=true";
    axios
      .get(apiUri)
      .then((response) => {
        setPorftolios(response.data);
      })
      .finally(() => setHasFetched(true));
  }, []);
  return (
    <main className={!hasFetched ? "flex items-center justify-center" : ""}>
      {!hasFetched ? <Loader /> : <HomeContent portfolios={portfolios} />}
    </main>
  );
}
