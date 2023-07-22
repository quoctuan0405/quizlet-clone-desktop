import { useState } from "react";
import _ from "lodash";

export const useCoords = () => {
  const [coords, setCoords] = useState({ x: -1, y: -1 });

  const calculateAndSetCoords = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCoords({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return [coords, calculateAndSetCoords] as const;
};
