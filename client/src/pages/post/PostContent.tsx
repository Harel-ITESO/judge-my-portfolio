import { Portfolio } from "../..";

interface Props {
  post: Portfolio;
}

export default function PostContent({ post }: Props) {
  return (
    <div className="self-center">
      <div className="border-4 border-black">
        <div>
          <img src={post.thumbnailImage} alt="" />
        </div>
      </div>
    </div>
  );
}
