interface Props {
  children?: JSX.Element | JSX.Element[] | string;
  type?: "main" | "secondary";
  isLink?: boolean;
  href?: string;
  className?: string;
}

export default function Button({
  children,
  type = "main",
  className,
  isLink = false,
  href = "#",
}: Props) {
  const mainClassNames = "text-white bg-black hover:bg-neutral-900";
  const secondaryClassName = "text-white bg-red-500 hover:bg-red-400";
  const typeClassName = type === "main" ? mainClassNames : secondaryClassName;
  if (!isLink)
    return (
      <button
        className={`rounded-lg ${typeClassName} px-4 py-1 text-lg transition-all ${className}`}
      >
        {children}
      </button>
    );
  return (
    <a
      href={href}
      type="button"
      className={`rounded-lg ${typeClassName} px-4 py-1 text-lg transition-all inline-block text-center ${className}`}
      target="_blank"
    >
      {children}
    </a>
  );
}
