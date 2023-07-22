import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Ripple } from "../Ripple";
import { useCoords } from "../Ripple/hooks/useCoords";
import classNames from "classnames";

type Variant = "primary" | "secondary" | "white" | "transparent";
type Size = "default" | "small" | "large";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const IconButton: React.FC<Props> = ({
  children,
  variant = "white",
  size = "default",
  className,
  onClick,
  ...rest
}) => {
  const [forceRippleKey, setForceRippleKey] = useState<string>();
  const [coords, calculateAndSetCoords] = useCoords();

  const buttonSizeClassName = classNames({
    "w-10 h-10": size === "large",
    "w-9 h-9": size === "default",
    "w-8 h-8": size === "small",
    "bg-white dark:bg-purple-600": variant === "white",
    "bg-purple-600": variant === "primary",
    "bg-white/0 hover:bg-white/10 shadow-none": variant === "transparent",
  });

  return (
    <button
      className={`relative overflow-hidden dark:bg-opacity-50 hover:brightness-110 outline-none rounded-full shadow active:shadow-none ${buttonSizeClassName} ${className}`}
      onClick={(event) => {
        calculateAndSetCoords(event);
        setForceRippleKey(uuidv4());

        onClick && onClick(event);
      }}
      {...rest}
    >
      <Ripple
        className="bg-slate-300 dark:bg-purple-500"
        rippleKey={forceRippleKey}
        size={30}
        coords={coords}
      />
      {children}
    </button>
  );
};
