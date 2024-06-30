import { Link } from "react-router-dom";
import { PortfolioCurrentUser, Portfolio } from "../..";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  portfolio?: Portfolio;
}

function CurrentUserPortfolio({
  postId,
  postName,
  thumbnailImage,
}: PortfolioCurrentUser) {
  return (
    <div className="flex flex-col items-center gap-5">
      <h4>
        You have a <span className="text-red-500 italic">portfolio</span> posted
        here!
      </h4>
      <Link
        className="w-2/4 bg-black rounded-lg relative flex group border-4 border-red-500"
        to={`/post/${postId}`}
      >
        <p className="absolute w-full self-center text-center text-xl text-white transition-all hidden group-hover:block z-50">
          Go to post
        </p>
        <img
          src={thumbnailImage}
          alt={`Your post named ${postName}`}
          className="w-full rounded-lg group-hover:opacity-25 opacity-100 transition-all group-hover:scale-95"
        />
      </Link>
    </div>
  );
}

export default function AccountData({ portfolio }: Props) {
  const authContext = useAuth();
  return (
    <div className="flex flex-col items-center gap-12">
      <div className="flex flex-col items-center">
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
      {portfolio ? (
        <CurrentUserPortfolio
          thumbnailImage={portfolio.thumbnailImage}
          postId={portfolio.postId}
          postName={portfolio.postName}
        />
      ) : (
        <span className="mt-32 text-center italic">
          Hmm... You still haven't posted something yet.{" "}
          <Link to="#" className="text-red-500 underline hover:text-red-600">
            Post your portfolio here!
          </Link>
        </span>
      )}
    </div>
  );
}
