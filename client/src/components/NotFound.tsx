export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <h4 className="text-7xl">
        Error <span className="text-red-500">404</span>
      </h4>
      <span>
        The <span className="text-red-500 italic">resource</span> you are
        looking for can't be found <span className="text-red-500">:(</span>
      </span>
    </div>
  );
}
