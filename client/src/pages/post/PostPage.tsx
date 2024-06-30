import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Portfolio } from "../..";
import Loader from "../../components/Loader";
import PostContent from "./PostContent";
import NotFound from "../../components/NotFound";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Portfolio>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const apiUri =
      import.meta.env.VITE_API_URI +
      "/post/" +
      id +
      "?author=true&comments=true";
    axios
      .get(apiUri)
      .then((response) => {
        setPost({ ...response.data });
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <main className="flex flex-col justify-center">
      {loading ? <Loader /> : post ? <PostContent post={post} /> : <NotFound />}
    </main>
  );
}
