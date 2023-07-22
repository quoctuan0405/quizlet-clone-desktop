import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useState,
} from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Ripple } from "../Ripple";
import { useCoords } from "../Ripple/hooks/useCoords";
import classNames from "classnames";

type Variant =
  | "default"
  | "colorful"
  | "secondary"
  | "tertiary"
  | "transparent";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button = React.forwardRef<any, Props>(
  ({ children, variant = "default", className, onClick, ...rest }, ref) => {
    const [forceRippleKey, setForceRippleKey] = useState<string>();
    const [coords, calculateAndSetCoords] = useCoords();

    const backgroundClass = classNames({
      "bg-purple-400 dark:bg-purple-700": variant === "default",
      "bg-gradient-to-r from-indigo-400 to-purple-400 dark:from-indigo-700 dark:to-purple-700":
        variant === "colorful",
      "bg-purple-500/20 dark:bg-purple-800/60 shadow-sm":
        variant === "secondary",
      "bg-white/50 dark:bg-indigo-700 shadow-sm": variant === "tertiary",
      "bg-white/0 shadow-none": variant === "transparent",
    });

    const rippleClass = classNames({
      "bg-purple-50": variant === "tertiary",
    });

    return (
      <button
        ref={ref}
        className={`relative overflow-hidden ${backgroundClass} hover:brightness-110 disabled:hover:brightness-100 outline-none px-4 py-1 rounded-md shadow active:shadow-none disabled:shadow-sm duration-100 text-white font-normal cursor-pointer ${className}`}
        onClick={(event) => {
          calculateAndSetCoords(event);
          setForceRippleKey(uuidv4());

          onClick && onClick(event);
        }}
        {...rest}
      >
        <Ripple
          className={rippleClass}
          rippleKey={forceRippleKey}
          coords={coords}
          size={50}
        />
        {children}
      </button>
    );
  }
);
