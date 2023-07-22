import { Variants, motion, useForceUpdate } from "framer-motion";
import { MarkButton } from "../../MarkButton";
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faBold,
  faCode,
  faItalic,
  faUnderline,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VerticalBar } from "../../VerticalBar";
import { CustomEditor } from "../model/CustomEditor";
import { HistoryEditor } from "slate-history";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { isMarkActive } from "../model/isMarkActive";
import { isBlockActive } from "../model/isBlockActive";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const toolbarAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    height: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    height: "auto",
    marginTop: -12,
    marginBottom: 5,
  },
};

interface Props {
  editor: HistoryEditor & BaseEditor & ReactEditor;
  forceUpdate?: VoidFunction;
}

export const Toolbar: React.FC<Props> = ({ editor, forceUpdate }) => {
  return (
    <motion.div
      className="flex flex-wrap flex-row"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
      variants={toolbarAnimation}
    >
      <MarkButton
        active={isMarkActive(editor, "bold")}
        onMouseDown={() => {
          CustomEditor.toggleBold(editor);
          forceUpdate && forceUpdate();
        }}
      >
        <FontAwesomeIcon
          icon={faBold}
          className="text-base dark:text-purple-200/70 text-slate-500/75"
        />
      </MarkButton>
      <MarkButton
        active={isMarkActive(editor, "italic")}
        onMouseDown={() => {
          CustomEditor.toggleItalic(editor);
          forceUpdate && forceUpdate();
        }}
      >
        <FontAwesomeIcon
          icon={faItalic}
          className="text-base dark:text-purple-200/70 text-slate-500/75"
        />
      </MarkButton>
      <MarkButton
        active={isMarkActive(editor, "underline")}
        onMouseDown={() => {
          CustomEditor.toggleUnderline(editor);
          forceUpdate && forceUpdate();
        }}
      >
        <FontAwesomeIcon
          icon={faUnderline}
          className="text-base dark:text-purple-200/70 text-slate-500/75"
        />
      </MarkButton>
      <VerticalBar />
      <MarkButton
        active={isBlockActive(editor, "left")}
        onMouseDown={() => {
          CustomEditor.toggleLeft(editor);
          forceUpdate && forceUpdate();
        }}
      >
        <FontAwesomeIcon
          icon={faAlignLeft}
          className="text-base dark:text-purple-200/70 text-slate-500/75"
        />
      </MarkButton>
      <MarkButton
        active={isBlockActive(editor, "center")}
        onMouseDown={() => {
          CustomEditor.toggleCenter(editor);
          forceUpdate && forceUpdate();
        }}
      >
        <FontAwesomeIcon
          icon={faAlignCenter}
          className="text-base dark:text-purple-200/70 text-slate-500/75"
        />
      </MarkButton>
      <MarkButton
        active={isBlockActive(editor, "right")}
        onMouseDown={() => {
          CustomEditor.toggleRight(editor);
          forceUpdate && forceUpdate();
        }}
      >
        <FontAwesomeIcon
          icon={faAlignRight}
          className="text-base dark:text-purple-200/70 text-slate-500/75"
        />
      </MarkButton>
      <VerticalBar />
      <MarkButton
        active={isBlockActive(editor, "code")}
        onMouseDown={() => {
          CustomEditor.toggleCodeBlock(editor);
          forceUpdate && forceUpdate();
        }}
      >
        <FontAwesomeIcon
          icon={faCode}
          className="text-base dark:text-purple-200/70 text-slate-500/75"
        />
      </MarkButton>
    </motion.div>
  );
};
