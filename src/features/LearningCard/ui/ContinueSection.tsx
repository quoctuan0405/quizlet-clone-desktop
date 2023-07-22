import { Variants, motion } from "framer-motion";
import { Descendant } from "slate";
import { TextEditor } from "../../../shared/TextEditor";
import { Button } from "../../../shared/Button";
import { AnimationStage } from "../type";
import { useEffect } from "react";

const explantionAnimation: Variants = {
  [AnimationStage.HIDDEN]: { opacity: 0, height: 0, display: "none" },
  [AnimationStage.VISIBLE]: { opacity: 1, height: "auto", display: "block" },
};

const nextButtonAnimation: Variants = {
  [AnimationStage.HIDDEN]: { opacity: 0, height: 0, display: "none" },
  [AnimationStage.VISIBLE]: { opacity: 1, height: "auto", display: "block" },
};

interface Props {
  show?: boolean;
  explanation?: Descendant[] | string;
  onNextQuestion: () => any;
}

export const ContinueSection: React.FC<Props> = ({
  show,
  explanation,
  onNextQuestion,
}) => {
  useEffect(() => {
    if (show) {
      document.addEventListener("keydown", onNextQuestion, false);

      return () => document.removeEventListener("keydown", onNextQuestion);
    }
  }, [show]);

  return (
    <>
      <motion.div
        className="mt-4"
        variants={explantionAnimation}
        initial={AnimationStage.HIDDEN}
        animate={show ? AnimationStage.VISIBLE : AnimationStage.HIDDEN}
      >
        <p className="font-bold text-base text-purple-500/80 dark:text-purple-300 dark:font-semibold">
          Explanation
        </p>
        <div className="font-semibold text-slate-500 dark:text-purple-300 mt-1">
          {explanation ? (
            <TextEditor readOnly initialValue={explanation} />
          ) : (
            <p className="dark:text-purple-400 text-base italic">
              No explanation
            </p>
          )}
        </div>
      </motion.div>
      <motion.div
        className="mt-5 w-full"
        variants={nextButtonAnimation}
        initial={AnimationStage.HIDDEN}
        animate={show ? AnimationStage.VISIBLE : AnimationStage.HIDDEN}
      >
        <Button
          variant="colorful"
          className="py-2 lg:py-3 rounded-lg font-semibold text-white w-full"
          onClick={() => {
            onNextQuestion();
          }}
        >
          Continue
        </Button>
      </motion.div>
    </>
  );
};
