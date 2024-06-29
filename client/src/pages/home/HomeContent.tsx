import { PortfolioCardPost } from "../..";
import PortfolioCard from "./PortfolioCard";
import swal from "sweetalert2";

interface Props {
  portfolios?: PortfolioCardPost[];
}

export default function HomeContent({ portfolios }: Props) {
  return (
    <div className="flex flex-wrap xl:px-44 px-32 py-10 gap-10 items-center lg:justify-between justify-center">
      {/* add new portfolio from current user */}
      <div
        className=" outline-red-500 outline-dashed w-72 rounded-lg flex items-center justify-center text-red-500 hover:bg-black hover:bg-opacity-15 cursor-pointer"
        style={{ height: 344 }}
        onClick={() => {
          swal.fire({
            text: "Do you want to post new a portfolio?",
            confirmButtonColor: "#ef4444",
            showCancelButton: true,
            icon: "question",
          });
        }}
      >
        <span className="fa-solid fa-plus"></span>
      </div>
      {portfolios?.map((p, i) => (
        <PortfolioCard key={i} {...p} />
      ))}
    </div>
  );
}
