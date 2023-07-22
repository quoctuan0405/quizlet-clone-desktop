import { useMemo, useState } from "react";
import { Descendant } from "slate";
import { Variants, motion } from "framer-motion";
import { Term } from "../Term";
import { Card } from "../../shared/Card";
import { ControlBar } from "./ui/ControlBar";
import { Align } from "../../shared/TextEditor/model/CustomEditor";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const listAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

interface Term {
  id: string;
  question: string | Descendant[];
  answer: string | Descendant[];
  explanation?: string | Descendant[];
}

interface Props {
  terms?: Term[];
}

export const ListTerm: React.FC<Props> = ({ terms }) => {
  const [leftTermAlign, setLeftTermAlign] = useState<Align>("right");
  const [rightTermAlign, setRightTermAlign] = useState<Align>("left");

  return (
    <>
      <ControlBar
        leftAlign={leftTermAlign}
        rightAlign={rightTermAlign}
        onLeftAlignChange={(align) => setLeftTermAlign(align)}
        onRightAlignChange={(align) => setRightTermAlign(align)}
      />
      {terms && terms.length !== 0 && (
        <motion.div
          className="flex flex-col flex-wrap space-y-3 lg:space-y-5 mt-3"
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={listAnimation}
        >
          {terms.map((term) => (
            <motion.div
              className="block w-full h-fit"
              key={term.id}
              variants={itemAnimation}
            >
              <Term
                term={term}
                leftAlign={leftTermAlign}
                rightAlign={rightTermAlign}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};
