import { BrowserRouter, Route, Routes } from "react-router-dom";
import AccountPage from "./pages/account/AccountPage";
import HomePage from "./pages/home/HomePage";

import Layout from "./components/Layout";
import AuthOptions from "./pages/login/AuthOptions";
import AuthRedirect from "./pages/login/AuthRedirect";

import { AuthProvider } from "./contexts/AuthContext";
import AuthMessage from "./pages/login/AuthMessage";
import PostPage from "./pages/post/PostPage";
import CreatePostPage from "./pages/post/CreatePostPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="h-screen flex flex-col">
          {/* <header>
          <Navbar />
        </header> */}
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/post/create" element={<CreatePostPage />} />
            </Route>
            <Route path="/login" element={<AuthOptions />}></Route>
            <Route path="/login/successful" element={<AuthRedirect />}></Route>
            <Route path="login/message" element={<AuthMessage />}></Route>
          </Routes>
          {/* <footer>
          <Footer />
        </footer> */}
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
