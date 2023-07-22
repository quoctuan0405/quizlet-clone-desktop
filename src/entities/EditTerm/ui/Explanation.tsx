import { useState } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { TextEditor } from "../../../shared/TextEditor";
import { IconButton } from "../../../shared/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

enum AnimationStage {
  HIDDEN_EXPLANATION = "hidden_explanation",
  VISIBLE_EXPLANATION = "visible_explanation",
}

const explanationAnimation: Variants = {
  [AnimationStage.HIDDEN_EXPLANATION]: {
    opacity: 0,
    height: 0,
    marginTop: 0,
  },
  [AnimationStage.VISIBLE_EXPLANATION]: {
    opacity: 1,
    height: "auto",
    marginTop: "1.25rem",
  },
};

const arrowIconAnimation: Variants = {
  [AnimationStage.HIDDEN_EXPLANATION]: {
    rotate: 0,
    transition: {
      stiffness: 10,
      damping: 1000,
    },
  },
  [AnimationStage.VISIBLE_EXPLANATION]: {
    rotate: 180,
    transition: {
      stiffness: 10,
      damping: 1000,
    },
  },
};

interface Props {
  children: React.ReactNode;
}

export const Explanation: React.FC<Props> = ({ children }) => {
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  return (
    <>
      <div className="px-4">
        <AnimatePresence>
          {showExplanation ? (
            <motion.div
              initial={AnimationStage.HIDDEN_EXPLANATION}
              animate={AnimationStage.VISIBLE_EXPLANATION}
              exit={AnimationStage.HIDDEN_EXPLANATION}
              variants={explanationAnimation}
            >
              {children}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="w-full px-3 py-3">
        <IconButton
          tabIndex={-1}
          className="ml-auto block hover:brightness-90 shadow-none duration-100 w-8 h-8 lg:w-9 lg:h-9"
          onClick={() => setShowExplanation((prevState) => !prevState)}
        >
          <motion.div
            className="m-auto"
            initial={AnimationStage.HIDDEN_EXPLANATION}
            animate={
              showExplanation
                ? AnimationStage.HIDDEN_EXPLANATION
                : AnimationStage.VISIBLE_EXPLANATION
            }
            variants={arrowIconAnimation}
          >
            <FontAwesomeIcon
              icon={faChevronUp}
              className="text-slate-500/90 dark:text-white/70 text-sm"
            />
          </motion.div>
        </IconButton>
      </div>
    </>
  );
};
