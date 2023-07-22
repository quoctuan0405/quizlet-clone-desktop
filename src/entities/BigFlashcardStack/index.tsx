import React, { useCallback, useState } from "react";
import { Descendant } from "slate";
import { BigFlashcard } from "../BigFlashcard";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useHotkeys } from "react-hotkeys-hook";

import { ExplanationCard } from "./ui/ExplanationCard";
import { ControlBar } from "./ui/ControlBar";
import { Align } from "../../shared/TextEditor/model/CustomEditor";

enum AnimationStage {
  PREVIOUS = "previous",
  NEXT = "next",
}

const bigFlashcardAnimation = {
  [AnimationStage.PREVIOUS]: {
    x: [-50, 0],
    boxShadow: [
      "0px 0px 10px rgba(0,0,0,0.15)",
      "0px 0px 2px rgba(0,0,0,0.25)",
      "0px 0px 3px rgba(0,0,0,0.25)",
      "none",
    ],
    rotateY: [-15, 0],
    rotateX: 0,
    transition: {
      stiffness: 10,
    },
  },
  [AnimationStage.NEXT]: {
    x: [50, 0],
    boxShadow: [
      "0px 0px 10px rgba(0,0,0,0.15)",
      "0px 0px 2px rgba(0,0,0,0.25)",
      "0px 0px 3px rgba(0,0,0,0.25)",
      "none",
    ],
    rotateY: [15, 0],
    rotateX: 0,
    transition: {
      stiffness: 10,
    },
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

export const BigFlashcardStack: React.FC<Props> = ({ terms }) => {
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showTermIndex, setShowTermIndex] = useState<number>(0);
  const [align, setAlign] = useState<Align>("center");
  const [animationState, setAnimationState] = useState<AnimationStage>();
  const [forceRunAnimation, setForceRunAnimation] = useState<string>(uuidv4());

  const previousTerm = useCallback(() => {
    setAnimationState(AnimationStage.PREVIOUS);
    setForceRunAnimation(uuidv4());

    if (terms && terms.length > 0) {
      if (showTermIndex == 0) {
        setShowTermIndex(terms.length - 1);
      } else {
        setShowTermIndex((prevTermIndex) => prevTermIndex - 1);
      }
    }
  }, [terms, showTermIndex]);

  const nextTerm = useCallback(() => {
    setAnimationState(AnimationStage.NEXT);
    setForceRunAnimation(uuidv4());

    if (terms && terms.length > 0) {
      if (showTermIndex == terms.length - 1) {
        setShowTermIndex(0);
      } else {
        setShowTermIndex((prevTermIndex) => prevTermIndex + 1);
      }
    }
  }, [terms, showTermIndex]);

  useHotkeys("left", () => {
    previousTerm();
  });

  useHotkeys("right", () => {
    nextTerm();
  });

  useHotkeys("e", () => {
    setShowExplanation((prevState) => !prevState);
  });

  return (
    <div>
      {/* Big flashcard */}
      <div>
        {terms && terms.length !== 0 && (
          <motion.div
            key={forceRunAnimation}
            animate={animationState}
            variants={bigFlashcardAnimation}
          >
            <BigFlashcard align={align} term={terms[showTermIndex]} />
          </motion.div>
        )}
      </div>

      {/* Control */}
      <ControlBar
        currentIndex={showTermIndex}
        totalCount={terms?.length || 0}
        align={align}
        previousTerm={previousTerm}
        nextTerm={nextTerm}
        showExplanationClick={() =>
          setShowExplanation((prevState) => !prevState)
        }
        onAlignChange={(align) => setAlign(align)}
      />

      {/* Explanation */}
      <ExplanationCard
        visible={showExplanation}
        explanation={terms && terms[showTermIndex]?.explanation}
      />
    </div>
  );
};
