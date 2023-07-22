import { useCallback, useEffect, useState } from "react";
import { Descendant } from "slate";
import { v4 as uuidv4 } from "uuid";
import { Variants, motion } from "framer-motion";
import { useSpacePreventDefault } from "./hooks/useSpacePreventDefault";
import { useHotkeys } from "react-hotkeys-hook";
import { TextEditor } from "../../shared/TextEditor";
import { Align } from "../../shared/TextEditor/model/CustomEditor";

enum AnimationStage {
  INITIAL = "initial",
  FLIP = "flip",
}

const cardAnimation: Variants = {
  [AnimationStage.INITIAL]: {
    x: 0,
    rotateX: 0,
    rotateY: 0,
    boxShadow: [
      "0px 0px 5px rgba(0,0,0,0.15)",
      "0px 0px 2px rgba(0,0,0,0.20)",
      "0px 0px 3px rgba(0,0,0,0.15)",
      "0px 0px 3px rgba(0,0,0,0.10)",
    ],
    transition: {
      stiffness: 0,
    },
  },
  [AnimationStage.FLIP]: {
    x: 0,
    rotateX: 180,
    rotateY: 0,
    boxShadow: [
      "0px 0px 5px rgba(0,0,0,0.15)",
      "0px 0px 2px rgba(0,0,0,0.20)",
      "0px 0px 3px rgba(0,0,0,0.15)",
      "0px 0px 3px rgba(0,0,0,0.10)",
    ],
    transition: {
      stiffness: 0,
    },
  },
};

const textAnimation: Variants = {
  [AnimationStage.INITIAL]: {
    rotateX: 0,
    opacity: 100,
  },
  [AnimationStage.FLIP]: {
    rotateX: 180,
    opacity: [0, 100],
  },
};

interface Term {
  id: string;
  question: string | Descendant[];
  answer: string | Descendant[];
  explanation?: string | Descendant[];
}

interface Props {
  align: Align;
  term: Term;
}

export const BigFlashcard: React.FC<Props> = ({ term, align }) => {
  const [isFront, setIsFront] = useState<boolean>(true);
  const [animationState, setAnimationState] = useState<AnimationStage>(
    AnimationStage.INITIAL
  );
  const [forceRunAnimation, setForceRunAnimation] = useState<string>(uuidv4());

  const flipCard = useCallback(() => {
    setIsFront((prevState) => !prevState);
    setAnimationState(AnimationStage.FLIP);
    setForceRunAnimation(uuidv4());
  }, []);

  // Shortcut
  useSpacePreventDefault();

  useHotkeys("space", () => {
    flipCard();
  });

  return (
    <motion.div
      className="w-full h-96 p-5 bg-white dark:bg-purple-600 bg-opacity-60 dark:bg-opacity-60 rounded-lg cursor-pointer"
      key={forceRunAnimation}
      initial={AnimationStage.INITIAL}
      animate={animationState}
      variants={cardAnimation}
      onClick={() => {
        flipCard();
      }}
    >
      <motion.div
        className={`${
          align === "center" && "flex flex-wrap items-center justify-center"
        }  w-full h-full font-semibold text-xl lg:text-2xl text-slate-500 dark:text-white`}
        variants={textAnimation}
      >
        {isFront ? (
          <TextEditor readOnly align={align} initialValue={term.question} />
        ) : (
          <TextEditor readOnly align={align} initialValue={term.answer} />
        )}
      </motion.div>
    </motion.div>
  );
};
