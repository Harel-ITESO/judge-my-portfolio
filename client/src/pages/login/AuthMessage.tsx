import { Link } from "react-router-dom";

export default function AuthMessage() {
  return (
    <>
      <header className="bg-black">
        <h1 className="text-lg m-3 text-white">
          <Link className="hover:text-neutral-200 transition-all" to="/">
            <span className="fa-solid fa-code -rotate-45 text-red-500"></span>{" "}
            Judge My Portfolio
          </Link>
        </h1>
      </header>
      <main className="flex items-center justify-center bg-black text-white flex-col ">
        <h2>
          You are already <span className="italic">Authenticated </span>
          <Link to="/" className="text-red-500 underline inline">
            Go back to homepage
          </Link>
        </h2>
      </main>
    </>
  );
}
