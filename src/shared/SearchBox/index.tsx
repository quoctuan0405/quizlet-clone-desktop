import React, { useEffect, useRef, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

interface Props {
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  className?: string;
}

export const SearchBox = React.forwardRef<any, Props>(
  ({ onChange, className }, ref) => {
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [isHover, setIsHover] = useState<boolean>(false);

    return (
      <motion.div
        ref={ref}
        className={`flex flex-wrap items-center bg-purple-50 dark:bg-purple-800 border-2 bg-clip-padding
        ${isHover && "shadow-inner"}
        ${
          isFocus
            ? "border-purple-200 dark:border-purple-500 shadow-inner"
            : "border-transparent hover:border-purple-100 dark:hover:border-purple-600"
        }  
        rounded-full max-w-max pl-4 pr-1 py-1 duration-100 
        ${className}
        `}
        onHoverStart={() => {
          setIsHover(true);
        }}
        onHoverEnd={() => {
          setIsHover(false);
        }}
      >
        <input
          placeholder="Search"
          className={`bg-transparent placeholder-purple-400 dark:placeholder-purple-300
          ${
            isHover || isFocus
              ? "placeholder-opacity-90"
              : "placeholder-opacity-70"
          }  
        text-purple-700 dark:text-purple-100 text-base font-semibold focus-visible:outline-none`}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.currentTarget.blur();
            }
          }}
          onFocus={() => {
            setIsFocus(true);
          }}
          onBlur={() => {
            setIsFocus(false);
          }}
          onChange={onChange}
        />
        <div className="flex flex-wrap items-center justify-center bg-white rounded-full w-8 h-8 ml-2">
          <FontAwesomeIcon icon={faSearch} className="text-purple-500" />
        </div>
      </motion.div>
    );
  }
);
