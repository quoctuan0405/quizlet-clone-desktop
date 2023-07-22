import { useEffect, useRef, useState } from "react";
import { useIsVisibleOnContainer } from "../../../hooks/useIsVisibleOnContainer";
import { useHotkeys } from "react-hotkeys-hook";

export const useHoverItemByHotkey = (itemsLength: number) => {
  const [hoverItemIndex, setHoverItemIndex] = useState<number>(0);

  const isVisibleOnContainer = useIsVisibleOnContainer();

  const containerRef = useRef<HTMLDivElement>(null);
  const hoverItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  useHotkeys(
    "up",
    () => {
      if (hoverItemIndex === 0) {
        setHoverItemIndex(itemsLength - 1);
      } else {
        setHoverItemIndex((itemIndex) => (itemIndex ? itemIndex - 1 : 0));
      }
    },
    { enableOnFormTags: ["INPUT", "input"] }
  );

  useHotkeys(
    "down",
    () => {
      if (hoverItemIndex === itemsLength - 1) {
        setHoverItemIndex(0);
      } else {
        setHoverItemIndex((itemIndex) =>
          itemIndex !== undefined ? itemIndex + 1 : 0
        );
      }
    },
    { enableOnFormTags: ["INPUT", "input"] }
  );

  // Scroll to that element
  useEffect(() => {
    if (hoverItemRef.current && containerRef.current) {
      if (!isVisibleOnContainer(hoverItemRef.current, containerRef.current)) {
        if (
          hoverItemRef.current.getBoundingClientRect().top <
          containerRef.current.getBoundingClientRect().top
        ) {
          hoverItemRef.current.scrollIntoView(true); // Upper element
        } else {
          hoverItemRef.current.scrollIntoView(false); // Lower element
        }
      }
    }
  }, [hoverItemIndex, hoverItemRef.current]);

  return [
    hoverItemIndex,
    setHoverItemIndex,
    containerRef,
    hoverItemRef,
  ] as const;
};
