import { useEffect } from "react";

export function useTitle(title: string) {
  useEffect(() => {
    const base = "JMP - ";
    const prev = document.title;
    document.title = base + title;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
