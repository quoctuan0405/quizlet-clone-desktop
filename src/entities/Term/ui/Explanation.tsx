import { AnimatePresence, Variants, motion } from "framer-motion";
import { Descendant } from "slate";
import { TextEditor } from "../../../shared/TextEditor";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const explanationAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    transition: {
      duration: 0.185,
    },
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    height: "auto",
    marginTop: 20,
    transition: {
      duration: 0.185,
    },
  },
};

interface Props {
  visible: boolean;
  explanation?: string | Descendant[];
}

export const Explanation: React.FC<Props> = ({ visible, explanation }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          exit={AnimationStage.HIDDEN}
          variants={explanationAnimation}
        >
          <div className="bg-purple-100 dark:bg-purple-800 w-32 h-px rounded-full mb-3" />
          <div>
            {explanation ? (
              <p className="font-semibold text-slate-500/80 dark:text-white/80">
                <TextEditor readOnly initialValue={explanation} />
              </p>
            ) : (
              <p className="font-medium text-slate-400 italic dark:text-white/90">
                No explanation
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
