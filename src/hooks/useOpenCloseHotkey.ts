import React, { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface Props {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useOpenCloseHotkey = ({ showMenu, setShowMenu }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // Shortcut
  useHotkeys(
    "esc",
    () => {
      setShowMenu(false);
    },
    { enableOnFormTags: ["INPUT", "input"] }
  );

  useEffect(() => {
    if (showMenu) {
      const clickHandler = (event: MouseEvent) => {
        if (!ref.current?.contains(event.target as Node)) {
          setShowMenu(false);
        }
      };

      document.addEventListener("click", clickHandler, true);

      return () => {
        document.removeEventListener("click", clickHandler);
      };
    }
  }, [showMenu]);

  return ref;
};
