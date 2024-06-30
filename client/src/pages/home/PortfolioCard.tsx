import { Portfolio } from "../..";
import Button from "../../components/Button";

export default function PortfolioCard({
  postId,
  thumbnailImage,
  comments,
  createdBy,
  viewCount,
  webLink,
  repositoryLink,
  postName,
}: Portfolio) {
  return (
    <div className="border-2 border-black rounded-lg w-72">
      <div className="h-44">
        <img
          src={thumbnailImage}
          alt={`${createdBy.username}'s post thumbnail`}
          className="rounded-t-lg border-b-2 border-b-black object-contain md:h-44 xl:w-full overflow-hidden"
        />
      </div>
      <div className="p-2">
        <div className="text-wrap">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-lg capitalize">{postName}</h4>
            <div className="flex items-center gap-2">
              <a
                href={repositoryLink}
                className="text-2xl text-red-500 transition-all hover:text-red-400"
                target="_blank"
              >
                <span className="fa-brands fa-github"></span>
              </a>
              <a
                className="text-2xl text-red-500 transition-all hover:text-red-400"
                target="_blank"
                href={webLink}
              >
                <span className="fa-solid fa-link"></span>
              </a>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs">
            <span className="font-normal text-black">
              {" "}
              {createdBy.username}
            </span>
            <span className="font-bold">
              <span className="fa-solid fa-star text-yellow-500 text-right"></span>{" "}
              {4.5}
            </span>
          </div>
          <div className="flex mt-5 gap-5 text-red-500">
            <div className=" flex gap-1 items-center">
              <span className="fa-regular fa-eye"></span>
              {viewCount}
            </div>
            <div className=" flex gap-1 items-center">
              <span className="fa-regular fa-comment"></span>
              {comments.length}
            </div>
          </div>
        </div>
        <Button
          className="w-full mt-4 mb-1"
          type="secondary"
          href={`/post/${postId}`}
          isLink={true}
        >
          See Post
        </Button>
      </div>
    </div>
  );
}
