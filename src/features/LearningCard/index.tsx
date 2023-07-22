import { useState } from "react";
import { Variants, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Card } from "../../shared/Card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLearningProgressQuery,
  getRandomLearningTermQuery,
} from "../../providers/operation/queries";
import { reportLearningProgressMutation } from "../../providers/operation/mutations";
import _ from "lodash";
import { Align } from "../../shared/TextEditor/model/CustomEditor";
import { ControlBar } from "./ui/ControlBar";
import { ContinueSection } from "./ui/ContinueSection";
import { AnimationStage } from "./type";
import { QuestionSection } from "./ui/QuestionSection";
import { AnswerSection } from "./ui/AnswerSection";

const cardAnimationDuration = 0.4;

const cardAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
    },
  },
  [AnimationStage.NEXT]: {
    opacity: [1, 0, 0, 1],
    y: [0, 50, 0],
    transition: {
      stiffness: 5,
      duration: cardAnimationDuration,
    },
  },
};

interface Props {
  setId?: string;
}

export const LearningCard: React.FC<Props> = ({ setId }) => {
  const queryClient = useQueryClient();

  const {
    data: term,
    isSuccess,
    refetch,
  } = useQuery({
    ...getRandomLearningTermQuery(setId || ""),
    enabled: !!setId,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation({
    ...reportLearningProgressMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(
        getLearningProgressQuery(setId || "").queryKey
      );
    },
  });

  const [align, setAlign] = useState<Align>("center");
  const [answerInText, setAnswerInText] = useState<boolean>(false);
  const [reverseQuestionAnswer, setReverseQuestionAnswer] =
    useState<boolean>(false);

  const [showMoveToNextQuestionSection, setShowMoveToNextQuestionSection] =
    useState<boolean>(false);
  const [answerCorrect, setAnswerCorrect] = useState<boolean>();

  const [cardAnimationState, setCardAnimationState] =
    useState<string>("visible");

  const [forceRunKey, setForceRunKey] = useState<string>(uuidv4());

  const nextQuestion = () => {
    setShowMoveToNextQuestionSection(false);
    setCardAnimationState("next");
    setForceRunKey(uuidv4());

    if (term) {
      mutate({ termId: term.id, isCorrect: answerCorrect || false });
    }

    refetch();

    setAnswerCorrect(undefined);
  };

  return (
    <motion.div
      key={forceRunKey}
      animate={cardAnimationState}
      variants={cardAnimation}
    >
      <Card className="p-5 bg-opacity-50 dark:bg-purple-800/60">
        <div className="flex flex-row flex-wrap">
          <p className="font-bold text-base text-purple-500/80 dark:text-purple-300 dark:font-semibold">
            Question
          </p>
          <ControlBar
            className="ml-auto"
            align={align}
            onAlignChange={(align) => {
              setAlign(align);
            }}
            reverse={reverseQuestionAnswer}
            onReverse={() =>
              setReverseQuestionAnswer((prevState) => !prevState)
            }
            answerInText={answerInText}
            onAnswerInText={() => setAnswerInText((prevState) => !prevState)}
          />
        </div>

        <QuestionSection
          term={term}
          align={align}
          reverseQuestionAnswer={reverseQuestionAnswer}
        />

        <div className="mt-5">
          <p className="font-bold text-base text-purple-500/80 dark:text-purple-300 dark:font-semibold">
            Answer
          </p>
        </div>
        <div className="mt-1">
          <AnswerSection
            term={term}
            reverseQuestionAnswer={reverseQuestionAnswer}
            answerInText={answerInText}
            onAnswer={(isCorrect) => {
              setAnswerCorrect(isCorrect);
              setShowMoveToNextQuestionSection(true);
            }}
            delayFocus={cardAnimationDuration}
          />
        </div>

        {/* Show explanation and continue button */}
        <ContinueSection
          show={showMoveToNextQuestionSection}
          explanation={term?.explanation}
          onNextQuestion={nextQuestion}
        />
      </Card>
    </motion.div>
  );
};
