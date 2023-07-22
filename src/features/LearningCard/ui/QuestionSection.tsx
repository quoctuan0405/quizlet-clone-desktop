import { TextEditor } from "../../../shared/TextEditor";
import { Align } from "../../../shared/TextEditor/model/CustomEditor";
import { TermWithChoices } from "../../../providers/operation/queries";

interface Props {
  term?: TermWithChoices;
  reverseQuestionAnswer?: boolean;
  align?: Align;
}

export const QuestionSection: React.FC<Props> = ({
  term,
  reverseQuestionAnswer = false,
  align,
}) => {
  return (
    <div className="text-center py-3">
      <div className="text-lg font-semibold text-slate-600 p-2">
        {term && (
          <TextEditor
            forceRerenderKey={
              !reverseQuestionAnswer ? term.question : term.answer
            }
            readOnly
            align={align}
            initialValue={!reverseQuestionAnswer ? term.question : term.answer}
          />
        )}
      </div>
    </div>
  );
};
