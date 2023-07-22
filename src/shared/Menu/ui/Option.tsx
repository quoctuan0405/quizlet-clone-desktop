import React from "react";
import { motion } from "framer-motion";
import { Ripple } from "../../Ripple";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useCoords } from "../../Ripple/hooks/useCoords";

interface Props {
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
}

export const Item = React.forwardRef<any, Props>(
  ({ children, className, onClick }, ref) => {
    const [coords, calculateAndSetCoords] = useCoords();
    const [forceRippleKey, setForceRippleKey] = useState<string>();

    return (
      <div
        ref={ref}
        className={`relative w-full overflow-hidden cursor-pointer rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 px-3 py-3 duration-100 ${className}`}
        onClick={(event) => {
          calculateAndSetCoords(event);
          setForceRippleKey(uuidv4());

          onClick && onClick(event);
        }}
      >
        {children}
        <Ripple
          className="z-10 bg-purple-50"
          rippleKey={forceRippleKey}
          coords={coords}
          size={50}
        />
      </div>
    );
  }
);
