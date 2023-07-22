import { useEffect, useRef, useState } from "react";
import { Descendant } from "slate";
import { Variants, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { AnimationStage } from "../type";
import { ChoiceButton } from "./Choice";
import { TextBox } from "../../../shared/TextBox";
import {
  convertDescendantToPlainText,
  convertListDescendantToPlainText,
} from "../../../shared/TextEditor/util/convertToPlainText";
import { TermWithChoices } from "../../../providers/operation/queries";
import _, { divide } from "lodash";
import { SubmitHandler, useForm } from "react-hook-form";
import { toLowerCaseNonAccentVietnamese } from "../../../hooks/nonAccentVietnamese";
import { removeAllWhitespace } from "../../../hooks/removeWhitespace";
import { Button } from "../../../shared/Button";
import { TextEditor } from "../../../shared/TextEditor";

const correctMessageAnimation: Variants = {
  [AnimationStage.HIDDEN]: { opacity: 0, height: 0, display: "none" },
  [AnimationStage.VISIBLE]: { opacity: 1, height: "auto", display: "block" },
};

interface AnswerFormValue {
  answer: string;
}

export interface Choice {
  id: string;
  content: string | Descendant[];
  isCorrect: boolean;
}

interface Props {
  term?: TermWithChoices;
  onAnswer?: (isCorrect: boolean) => any;
  reverseQuestionAnswer?: boolean;
  answerInText?: boolean;
  delayFocus?: number;
}

export const AnswerSection: React.FC<Props> = ({
  term,
  onAnswer,
  reverseQuestionAnswer = false,
  answerInText = false,
  delayFocus = 0,
}) => {
  const { register, handleSubmit, reset } = useForm<AnswerFormValue>();

  const [choices, setChoices] = useState<Choice[]>([]);

  const [isAnswerd, setIsAnswered] = useState<boolean>(false);
  const [answerCorrect, setAnswerCorrect] = useState<boolean>();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register("answer");

  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    reset();
    timerRef.current = setTimeout(() => {
      inputRef.current?.focus();
    }, delayFocus);
  }, [term]);

  useEffect(() => {
    if (term) {
      const newChoices: Choice[] = [];

      newChoices.push({
        id: term.id,
        content: reverseQuestionAnswer ? term.question : term.answer,
        isCorrect: true,
      });

      for (let choice of term.choices) {
        newChoices.push({
          id: uuidv4(),
          content: reverseQuestionAnswer ? choice.question : choice.answer,
          isCorrect:
            convertListDescendantToPlainText(
              reverseQuestionAnswer ? term.question : term.answer
            ) ===
            convertListDescendantToPlainText(
              reverseQuestionAnswer ? choice.question : choice.answer
            ),
        });
      }

      setChoices(_.shuffle(newChoices));
    }
  }, [term, reverseQuestionAnswer]);

  const onAnswerHandler = (isCorrect: boolean) => {
    setIsAnswered(true);
    setAnswerCorrect(isCorrect);

    onAnswer && onAnswer(isCorrect);
  };

  const onAnswerSubmit: SubmitHandler<AnswerFormValue> = (data) => {
    const rightAnswer = reverseQuestionAnswer ? term?.question : term?.answer;
    const rightAnswerSanitize = toLowerCaseNonAccentVietnamese(
      removeAllWhitespace(convertListDescendantToPlainText(rightAnswer || ""))
    );

    const answerSanitize = toLowerCaseNonAccentVietnamese(
      removeAllWhitespace(data.answer)
    );

    const isCorrect = rightAnswerSanitize === answerSanitize;

    onAnswerHandler(isCorrect);

    inputRef.current?.blur();
  };

  return (
    <>
      {/* Choices */}
      {answerInText ? (
        <div className="-mt-3 mb-5 w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              handleSubmit(onAnswerSubmit)();
            }}
            autoComplete="off"
          >
            <TextBox
              className="w-full text-xl"
              disabled={isAnswerd}
              ref={(e) => {
                ref(e);
                inputRef.current = e;
              }}
              {...rest}
            />
            {!isAnswerd && (
              <Button type="submit" className="w-full mt-5 py-2 lg:py-2.5">
                Submit
              </Button>
            )}
          </form>
        </div>
      ) : (
        <div className="w-full flex flex-wrap">
          {choices.map((choice, index) => (
            <div key={choice.id} className="w-6/12 p-2">
              <ChoiceButton
                answer={choice.content}
                isCorrect={choice.isCorrect}
                isAnswered={isAnswerd}
                index={index}
                onChoiceSelected={() => {
                  onAnswerHandler(choice.isCorrect);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Result */}
      <motion.div
        className={!answerInText ? "m-2" : "-mt-3"}
        initial={AnimationStage.HIDDEN}
        animate={isAnswerd ? AnimationStage.VISIBLE : AnimationStage.HIDDEN}
        variants={correctMessageAnimation}
      >
        {answerCorrect ? (
          <p className="font-semibold text-base text-emerald-500">
            You're correct!
          </p>
        ) : (
          <p className="font-semibold text-base text-red-500">Incorrect!</p>
        )}
      </motion.div>

      {isAnswerd && !answerCorrect && answerInText && (
        <div className="mt-3">
          <p className="font-bold text-base text-purple-500/80 dark:text-purple-300 dark:font-semibold">
            Correct Answer
          </p>
          <div className="mt-1">
            <TextEditor
              readOnly
              initialValue={
                reverseQuestionAnswer ? term?.question : term?.answer
              }
            />
          </div>
        </div>
      )}
    </>
  );
};
