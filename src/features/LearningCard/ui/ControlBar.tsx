import {
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MarkButton } from "../../../shared/MarkButton";
import { Align } from "../../../shared/TextEditor/model/CustomEditor";
import { IconButton } from "../../../shared/IconButton";
import { QuestionSetting } from "./QuestionSetting";

interface Props {
  className?: string;
  align: Align;
  onAlignChange: (align: Align) => any;
  reverse: boolean;
  onReverse: () => any;
  answerInText: boolean;
  onAnswerInText: () => any;
}

export const ControlBar: React.FC<Props> = ({
  className,
  align,
  onAlignChange,
  reverse,
  onReverse,
  answerInText,
  onAnswerInText,
}) => {
  return (
    <div className={`flex flex-wrap ${className}`}>
      <MarkButton
        onMouseDown={() => {
          onAlignChange("left");
        }}
        active={align === "left"}
      >
        <FontAwesomeIcon
          icon={faAlignLeft}
          className="text-slate-500/80 dark:text-purple-400"
        />
      </MarkButton>
      <MarkButton
        onMouseDown={() => {
          onAlignChange("center");
        }}
        active={align === "center"}
      >
        <FontAwesomeIcon
          icon={faAlignCenter}
          className="text-slate-500/80 dark:text-purple-400"
        />
      </MarkButton>
      <MarkButton
        onMouseDown={() => {
          onAlignChange("right");
        }}
        active={align === "right"}
      >
        <FontAwesomeIcon
          icon={faAlignRight}
          className="text-slate-500/80 dark:text-purple-400"
        />
      </MarkButton>
      <div className="ml-4">
        <QuestionSetting
          answerInText={answerInText}
          onAnswerInText={onAnswerInText}
          reverse={reverse}
          onReverse={onReverse}
        />
      </div>
    </div>
  );
};
