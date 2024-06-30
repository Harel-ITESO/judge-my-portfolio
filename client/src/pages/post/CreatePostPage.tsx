import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import CreatePostForm from "./CreatePostForm";

export default function CreatePostPage() {
  const authContext = useAuth();
  if (!authContext.isAuthenticated) return <Navigate to="/login" />;
  return (
    <main className="flex flex-col justify-center">
      <CreatePostForm />
    </main>
  );
}
