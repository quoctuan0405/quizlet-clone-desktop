import React, { useCallback } from "react";

export const useMergeRef = (refs: any[]) => {
  return useCallback(
    (element: React.ReactNode | React.ReactElement | HTMLElement | null) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(element);
        } else if (ref !== null) {
          ref.current = element;
        }
      });
    },
    refs
  );
};
