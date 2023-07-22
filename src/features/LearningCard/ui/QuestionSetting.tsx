import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "../../../shared/IconButton";
import {
  faEllipsisVertical,
  faPen,
  faRetweet,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useOpenCloseHotkey } from "../../../hooks/useOpenCloseHotkey";
import { useState } from "react";
import { Switch } from "../../../shared/Switch";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
  EXIT = "exit",
}

const menuAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.08,
    },
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.08,
    },
  },
  [AnimationStage.EXIT]: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.08,
    },
  },
};

interface Props {
  reverse?: boolean;
  onReverse?: () => any;
  answerInText?: boolean;
  onAnswerInText?: () => any;
}

export const QuestionSetting: React.FC<Props> = ({
  reverse,
  onReverse,
  answerInText,
  onAnswerInText,
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const ref = useOpenCloseHotkey({ showMenu, setShowMenu });

  return (
    <div ref={ref} className="relative">
      <IconButton
        size="small"
        className="shadow-none dark:shadow"
        onClick={() => setShowMenu((prevState) => !prevState)}
      >
        <div className="flex flex-wrap items-center justify-center">
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="text-slate-500/80 dark:text-purple-400 text-lg"
          />
        </div>
      </IconButton>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="absolute right-0 top-10 z-20"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.EXIT}
            variants={menuAnimation}
          >
            <div className="flex flex-col flex-wrap w-max shadow rounded-lg overflow-hidden">
              <div
                className="flex flex-row flex-wrap w-full items-center space-x-3 p-4 bg-white hover:bg-purple-50 dark:bg-purple-800/40 dark:hover:bg-purple-800/60 cursor-pointer"
                onClick={() => {
                  onReverse && onReverse();
                }}
              >
                <FontAwesomeIcon
                  icon={faRetweet}
                  className="text-xl text-purple-500/90 dark:text-purple-200"
                />
                <p className="flex-1 font-semibold text-base text-slate-500 dark:text-purple-200/80">
                  Reverse question / answer
                </p>
                <Switch on={reverse} />
              </div>
              <div
                className="flex flex-row flex-wrap w-full items-center space-x-3 p-4 bg-white hover:bg-purple-50 dark:bg-purple-800/40 dark:hover:bg-purple-800/60 cursor-pointer"
                onClick={() => {
                  onAnswerInText && onAnswerInText();
                }}
              >
                <FontAwesomeIcon
                  icon={faPen}
                  className="text-xl text-purple-500/90 dark:text-purple-200"
                />
                <p className="flex-1 font-semibold text-base text-slate-500 dark:text-purple-200/80">
                  Answer in text
                </p>
                <Switch on={answerInText} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
