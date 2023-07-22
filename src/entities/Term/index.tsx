import React, { useState } from "react";
import { Card } from "../../shared/Card";
import { Explanation } from "./ui/Explanation";
import { TextEditor } from "../../shared/TextEditor";
import { Descendant } from "slate";
import { Align } from "../../shared/TextEditor/model/CustomEditor";

interface Term {
  id: string;
  question: string | Descendant[];
  answer: string | Descendant[];
  explanation?: string | Descendant[];
}

interface Props {
  term: Term;
  leftAlign?: Align;
  rightAlign?: Align;
}

export const Term = React.forwardRef<any, Props>(
  ({ term, leftAlign = "left", rightAlign = "left" }, ref) => {
    const [showExplanation, setShowExplanation] = useState<boolean>(false);

    return (
      <Card
        ref={ref}
        className="cursor-pointer shadow-sm bg-opacity-40 dark:bg-opacity-40 hover:bg-opacity-70 hover:dark:bg-opacity-60 px-4 py-5 lg:px-6 lg:py-5 w-full h-fit duration-100"
        onClick={() => {
          setShowExplanation((prevState) => !prevState);
        }}
      >
        <div className="flex flex-wrap flex-row w-full h-fit">
          <div className="flex-1 pl-3 pr-8 lg:pr-11 border-r-2 border-purple-200/50 dark:border-purple-500/50">
            <div className="text-base lg:text-lg font-semibold text-slate-500 dark:text-white/90">
              <TextEditor
                readOnly
                align={leftAlign}
                initialValue={term.question}
              />
            </div>
          </div>
          <div className="flex-1 pl-7 lg:pl-10">
            <div className="text-base lg:text-lg font-semibold text-slate-500 dark:text-white/90">
              <TextEditor
                readOnly
                align={rightAlign}
                initialValue={term.answer}
              />
            </div>
          </div>
        </div>
        <Explanation visible={showExplanation} explanation={term.explanation} />
      </Card>
    );
  }
);
