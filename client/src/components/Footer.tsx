export default function Footer() {
  return (
    <>
      <div className="bg-black p-4 text-white flex items-center">
        <div className="justify-self-start opacity-70 flex items-center gap-2 text-2xl">
          <span className="fa-brands fa-react"></span>
          <span className="fa-brands fa-node-js"></span>
        </div>
        <div className="text-center justify-self-center w-full">
          <span className="opacity-70">
            <a
              href="https://harelog3.github.io/bio-links/"
              className="hover:underline"
              target="_blank"
            >
              Harel Olguín
            </a>{" "}
            &copy; All rights reserved
          </span>
        </div>
        <div className=" justify-self-end">
          <a
            className="hover:opacity-100 opacity-70 transition-opacity"
            href="https://github.com/harelog3/judge-my-portfolio"
            target="_blank"
          >
            <i className="fa-brands fa-github text-3xl"></i>
          </a>
        </div>
      </div>
    </>
  );
}
