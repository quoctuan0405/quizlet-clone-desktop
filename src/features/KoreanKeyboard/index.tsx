import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "../../shared/IconButton";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useState } from "react";

export const KoreanKeyboard = () => {
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);

  return (
    <div>
      <IconButton
        className="bg-purple-400 dark:bg-purple-700/50 shadow-sm"
        onClick={() => setShowKeyboard((prevState) => !prevState)}
      >
        <FontAwesomeIcon
          icon={faKeyboard}
          className="text-purple-400 dark:text-purple-300/80 text-xl mt-1"
        />
      </IconButton>

      <AnimatePresence>
        {showKeyboard && (
          <motion.img
            src="/images/keyboard-korean.svg"
            className="fixed left-52 lg:left-64 top-36 lg:top-52 z-50 bg-white cursor-move shadow w-[50rem]"
            drag
          />
        )}
      </AnimatePresence>
    </div>
  );
};
