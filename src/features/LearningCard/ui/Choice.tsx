import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Descendant } from "slate";
import { useHotkeys } from "react-hotkeys-hook";
import { Button } from "../../../shared/Button";
import { TextEditor } from "../../../shared/TextEditor";
import { useQuery } from "@tanstack/react-query";
import { getDarkModeSettingQuery } from "../../../providers/operation/queries";

interface Props {
  index: number;
  isAnswered: boolean;
  onChoiceSelected: () => any;
  answer: string | Descendant[];
  isCorrect: boolean;
}

type State = "correct" | "incorrect" | "initial";

const choiceAnimation: Variants = {
  initial: {},
  correct: {
    backgroundColor: "rgb(209 250 229)",
  },
  incorrect: {
    backgroundColor: "rgb(254 202 202)",
  },
};

const choiceNumberAnimation: Variants = {
  initial: {
    color: "rgb(148 163 184)",
  },
  correct: {
    backgroundColor: "rgb(167 243 208)",
    color: "rgb(5 150 105)",
  },
  incorrect: {
    backgroundColor: "rgb(252 165 165)",
    color: "rgb(220 38 38)",
  },
};

const darkModeChoiceAnimation: Variants = {
  initial: {},
  correct: {
    backgroundColor: "rgb(22 163 74 / 0.5)",
  },
  incorrect: {
    backgroundColor: "rgb(220 38 38 / 0.3)",
  },
};

const darkModeChoiceNumberAnimation: Variants = {
  initial: {
    color: "rgb(233 213 255 / 0.8)",
  },
  correct: {
    backgroundColor: "rgb(22 163 74 / 0.3)",
    color: "rgb(233 213 255 / 0.9)",
  },
  incorrect: {
    backgroundColor: "rgb(220 38 38 / 0.3)",
    color: "rgb(233 213 255 / 0.9)",
  },
};

export const ChoiceButton: React.FC<Props> = ({
  index,
  onChoiceSelected,
  answer,
  isCorrect,
  isAnswered,
}) => {
  const { data: darkMode } = useQuery({ ...getDarkModeSettingQuery() });
  const [state, setState] = useState<State>("initial");
  const [choiceSelected, setChoiceSelected] = useState<boolean>(false);

  useHotkeys(`${index + 1}`, () => {
    choiceSelectedHandler();
  });

  useEffect(() => {
    if (isAnswered) {
      if (isCorrect) {
        setState("correct");
      } else if (choiceSelected) {
        setState("incorrect");
      }
    } else {
      setState("initial");
    }
  }, [isAnswered]);

  const choiceSelectedHandler = () => {
    if (!choiceSelected) {
      setChoiceSelected(true);
      onChoiceSelected();
    }
  };

  const ButtonMotion = motion(Button);

  return (
    <ButtonMotion
      className="bg-white/50 dark:bg-purple-600/30 hover:bg-white/80 dark:hover:bg-purple-600/40 disabled:bg-white/60 dark:disabled:bg-purple-500/10 disabled:hover:bg-white/60 dark:disabled:hover:bg-purple-500/10 w-full py-3"
      disabled={isAnswered}
      onClick={choiceSelectedHandler}
      animate={state}
      variants={darkMode?.value ? darkModeChoiceAnimation : choiceAnimation}
    >
      <div className="flex flex-row flex-wrap">
        <motion.div
          className="p-1 rounded-full w-8 h-8 shadow mr-3 flex flex-wrap justify-center items-center"
          animate={state}
          variants={
            darkMode?.value
              ? darkModeChoiceNumberAnimation
              : choiceNumberAnimation
          }
        >
          <p className="font-semibold text-base leading-2 m-auto">
            {index + 1}
          </p>
        </motion.div>
        <div className="font-semibold text-base leading-2 my-auto">
          <TextEditor readOnly initialValue={answer} />
        </div>
      </div>
    </ButtonMotion>
  );
};
