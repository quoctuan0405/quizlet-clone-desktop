import { IconButton } from "../../../shared/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faChevronLeft,
  faChevronRight,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../../shared/Button";
import { MarkButton } from "../../../shared/MarkButton";
import { Align } from "../../../shared/TextEditor/model/CustomEditor";

interface Props {
  currentIndex: number;
  totalCount: number;
  align: Align;
  previousTerm: () => any;
  nextTerm: () => any;
  showExplanationClick: () => any;
  onAlignChange: (align: Align) => any;
}

export const ControlBar: React.FC<Props> = ({
  currentIndex,
  totalCount,
  align = "left",
  previousTerm,
  nextTerm,
  showExplanationClick,
  onAlignChange,
}) => {
  return (
    <div className="w-full h-max mt-2 relative">
      <div className="flex flex-wrap items-center absolute top-0 left-0 h-full">
        <MarkButton
          className="dark:hover:bg-purple-700/30"
          activeClassName="dark:bg-purple-700/50"
          onMouseDown={() => {
            onAlignChange("left");
          }}
          active={align === "left"}
        >
          <FontAwesomeIcon
            icon={faAlignLeft}
            className="text-purple-600/50 dark:text-purple-300/70"
          />
        </MarkButton>
        <MarkButton
          className="dark:hover:bg-purple-700/30"
          activeClassName="dark:bg-purple-700/50"
          onMouseDown={() => {
            onAlignChange("center");
          }}
          active={align === "center"}
        >
          <FontAwesomeIcon
            icon={faAlignCenter}
            className="text-purple-600/50 dark:text-purple-300/70"
          />
        </MarkButton>
        <MarkButton
          className="dark:hover:bg-purple-700/30"
          activeClassName="dark:bg-purple-700/50"
          onMouseDown={() => {
            onAlignChange("right");
          }}
          active={align === "right"}
        >
          <FontAwesomeIcon
            icon={faAlignRight}
            className="text-purple-600/50 dark:text-purple-300/70"
          />
        </MarkButton>
      </div>

      <div className="w-max h-max mx-auto mt-1 flex flex-row flex-wrap space-x-12 items-center">
        <div>
          <IconButton
            className="bg-opacity-40 shadow-sm"
            onClick={() => {
              previousTerm();
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-slate-500/70 dark:text-purple-200/80"
            />
          </IconButton>
        </div>
        <div>
          <p className="font-bold text-sm text-slate-500/60 dark:text-purple-200/70">
            {currentIndex + 1}/{totalCount}
          </p>
        </div>
        <div>
          <IconButton
            className="bg-opacity-40 shadow-sm"
            onClick={() => {
              nextTerm();
            }}
          >
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-slate-500/70 dark:text-purple-200/80"
            />
          </IconButton>
        </div>
      </div>

      <div className="absolute top-0 right-0">
        <Button
          variant="tertiary"
          className="ml-auto dark:bg-purple-800/80 dark:bg-opacity-60 py-2.5 px-5 flex flex-row flex-wrap items-center"
          onClick={() => {
            showExplanationClick();
          }}
        >
          <FontAwesomeIcon
            icon={faCommentDots}
            className="text-purple-500/60 dark:text-purple-200/80 text-xl"
          />
          <p className="font-bold text-sm text-purple-500/80 dark:text-purple-200 ml-3">
            Explanation
          </p>
        </Button>
      </div>
    </div>
  );
};
