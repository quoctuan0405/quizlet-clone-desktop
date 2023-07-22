import React from "react";
import { DragControls } from "framer-motion";
import { Card } from "../../shared/Card";
import { Explanation } from "./ui/Explanation";
import { IconButton } from "../../shared/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  index?: number;
  dragControl?: DragControls;
  questionEditor?: React.ReactNode;
  answerEditor?: React.ReactNode;
  explanationEditor?: React.ReactNode;
  onRemove?: () => any;
}

export const EditTerm = React.forwardRef<any, Props>(
  (
    {
      index,
      dragControl,
      questionEditor,
      answerEditor,
      explanationEditor,
      onRemove,
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className="overflow-hidden bg-white/30 dark:bg-purple-900/50"
      >
        {/* Header */}
        <div
          className={`px-2 py-1.5 lg:py-2 bg-gradient-to-r from-indigo-300/100 to-purple-300/100 dark:from-indigo-700/60 dark:to-purple-700/60 ${
            dragControl && "cursor-grab select-none"
          }`}
          onPointerDown={(e) => {
            dragControl && dragControl.start(e);
          }}
        >
          <div className="flex flex-row flex-wrap items-center">
            <p className="text-white dark:text-white/70 font-semibold text-sm lg:text-base pl-2 max-w-max">
              {index !== null && index !== undefined
                ? `Term ${index + 1}`
                : "Term"}
            </p>
            <IconButton
              tabIndex={-1}
              className="ml-auto bg-opacity-30 hover:bg-opacity-40 duration-100 w-8 h-8 lg:w-9 lg:h-9"
              onClick={() => {
                onRemove && onRemove();
              }}
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="text-purple-500 dark:text-purple-200/90 text-sm lg:text-base opacity-90"
              />
            </IconButton>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-row flex-wrap w-full px-3 py-5 lg:px-4 pb-0 space-x-3">
          <div className="flex-1 text-base lg:text-lg mt-auto">
            {questionEditor}
          </div>
          <div className="flex-1 text-base lg:text-lg mt-auto">
            {answerEditor}
          </div>
        </div>

        {/* Explanation */}
        <Explanation>{explanationEditor}</Explanation>
      </Card>
    );
  }
);
