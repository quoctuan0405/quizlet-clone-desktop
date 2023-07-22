import { useEffect } from "react";

export const useSpacePreventDefault = () => {
  useEffect(() => {
    const preventDefault = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target == document.body) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventDefault);

    return () => window.removeEventListener("keydown", preventDefault);
  }, []);
};
