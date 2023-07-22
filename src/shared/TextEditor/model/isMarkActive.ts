import { HistoryEditor } from "slate-history";
import { BaseEditor, Editor } from "slate";
import { ReactEditor } from "slate-react";

export const isMarkActive = (
  editor: HistoryEditor & BaseEditor & ReactEditor,
  format: string
) => {
  const marks = Editor.marks(editor);

  // @ts-ignore
  return marks ? marks[format] === true : false;
};
