import { Descendant } from "slate";
import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { Card } from "../../../shared/Card";
import { useEffect, useState } from "react";
import { TextEditor } from "../../../shared/TextEditor";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const explanationCardAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    height: 0,
    opacity: 0,
    marginTop: 0,
  },
  [AnimationStage.VISIBLE]: {
    height: "auto",
    opacity: 1,
    marginTop: 15,
  },
};

const explanationCardTextAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

interface Props {
  visible: boolean;
  explanation?: string | Descendant[];
}

export const ExplanationCard: React.FC<Props> = ({ explanation, visible }) => {
  const [forceRunAnimation, setForceRunAnimation] = useState<string>(uuidv4());

  useEffect(() => {
    setForceRunAnimation(uuidv4());
  }, [explanation]);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={explanationCardAnimation}
          >
            <Card className="px-5 py-3 bg-opacity-60 dark:bg-opacity-60">
              {explanation ? (
                <motion.p
                  key={forceRunAnimation}
                  className="font-semibold text-slate-500 dark:text-white"
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  variants={explanationCardTextAnimation}
                >
                  {<TextEditor readOnly initialValue={explanation} />}
                </motion.p>
              ) : (
                <motion.p
                  key={forceRunAnimation}
                  className="font-medium text-slate-400 italic dark:text-purple-300"
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  variants={explanationCardTextAnimation}
                >
                  No explanation
                </motion.p>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
