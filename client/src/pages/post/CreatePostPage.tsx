import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import CreatePostForm from "./CreatePostForm";

export default function CreatePostPage() {
  const authContext = useAuth();
  if (!authContext.isAuthenticated) return <Navigate to="/login" />;
  return (
    <main className="flex flex-col mt-5 gap-6">
      <h4 className="self-center text-xl">
        <span className="text-red-500">Upload your portfolio!</span>. Fill the
        information below
      </h4>
      <CreatePostForm />
    </main>
  );
}
