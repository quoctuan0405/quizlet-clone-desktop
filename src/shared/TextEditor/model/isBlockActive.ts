import { HistoryEditor } from "slate-history";
import { BaseEditor, Editor, Element } from "slate";
import { ReactEditor } from "slate-react";
import { Align, ElementType } from "./CustomEditor";

export const isBlockActive = (
  editor: HistoryEditor & BaseEditor & ReactEditor,
  format: Align | ElementType
) => {
  const { selection } = editor;
  if (!selection) {
    return false;
  }

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        (n.align === format || n.type === format),
    })
  );

  return !!match;
};
