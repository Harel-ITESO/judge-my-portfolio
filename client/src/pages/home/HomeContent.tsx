import { useNavigate } from "react-router-dom";
import { Portfolio } from "../..";
import PortfolioCard from "./PortfolioCard";
import swal from "sweetalert2";

interface Props {
  portfolios?: Portfolio[];
}

export default function HomeContent({ portfolios }: Props) {
  const navigate = useNavigate();
  return (
    <div className="xl:px-44 px-32 py-10">
      <div className="flex flex-wrap gap-10 items-center lg:justify-between justify-center">
        {/* add new portfolio from current user */}
        <div
          className=" outline-red-500 outline-dashed w-72 rounded-lg flex items-center justify-center text-red-500 hover:bg-black hover:bg-opacity-15 cursor-pointer"
          style={{ height: 344 }}
          onClick={() => {
            swal
              .fire({
                text: "Do you want to post new a portfolio?",
                confirmButtonColor: "#ef4444",
                showCancelButton: true,
                icon: "question",
              })
              .then((val) => {
                if (val.isConfirmed) navigate("/post/create");
              });
          }}
        >
          <span className="fa-solid fa-plus"></span>
        </div>
        {portfolios?.map((p, i) => (
          <PortfolioCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
}
