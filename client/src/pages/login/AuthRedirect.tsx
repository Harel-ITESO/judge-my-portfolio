import { useEffect } from "react";

export default function AuthRedirect() {
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    localStorage.setItem("token", token as string);
    window.location.href = "/";
  });
  return <></>;
}
