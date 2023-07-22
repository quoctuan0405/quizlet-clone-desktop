import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Variants, motion } from "framer-motion";
import { useEffect, useState } from "react";

enum AnimationState {
  LEFT = "left",
  RIGHT = "right",
}

const handleAnimation: Variants = {
  [AnimationState.LEFT]: {
    x: 0,
  },
  [AnimationState.RIGHT]: {
    x: 15,
  },
};

interface Props {
  className?: string;
  on?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
}

export const Switch: React.FC<Props> = ({ className, on = false, onClick }) => {
  const [isOn, setIsOn] = useState<boolean>(false);

  useEffect(() => {
    setIsOn(on);
  }, [on]);

  return (
    <div
      className={`w-10 h-6 flex items-center ${
        isOn
          ? "bg-purple-300 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500"
          : "shadow-inner bg-gray-300 dark:bg-purple-900"
      } rounded-full px-1 cursor-pointer`}
      onClick={(event) => {
        setIsOn((prevState) => !prevState);

        onClick && onClick(event);
      }}
    >
      <motion.div
        variants={handleAnimation}
        animate={isOn ? AnimationState.RIGHT : AnimationState.LEFT}
        className="bg-white w-4 h-4 rounded-full shadow-md block"
      ></motion.div>
    </div>
  );
};
