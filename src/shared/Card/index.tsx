import React from "react";
import { EventInfo, motion } from "framer-motion";
import classNames from "classnames";

export type Variant = "default" | "colorful";

interface Props {
  children?: React.ReactNode;
  className?: string;
  variant?: Variant;
  onHoverStart?(event: MouseEvent, info: EventInfo): void;
  onHoverEnd?(event: MouseEvent, info: EventInfo): void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card = React.forwardRef<any, Props>(
  ({ children, variant = "default", className, ...rest }, ref) => {
    const backgroundClass = classNames({
      "bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-700 dark:to-purple-700":
        variant === "colorful",
      "bg-white dark:bg-purple-700": variant === "default",
    });

    return (
      <motion.div
        ref={ref}
        className={`${backgroundClass} shadow rounded-md ${className}`}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);
