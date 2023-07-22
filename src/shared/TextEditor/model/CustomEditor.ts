import { Transforms, BaseEditor, Editor, Element, Text } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

export type Align = "left" | "center" | "right" | "justify";

export type ElementType = "paragraph" | "code";

export type CustomElement = {
  type: ElementType;
  children: CustomText[];
  align: Align;
};

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: HistoryEditor & BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export const CustomEditor = {
  toggleCodeBlock: (editor: Editor) => {
    const [isCodeBlock] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === "code",
    });

    Transforms.setNodes(editor, {
      type: isCodeBlock ? "paragraph" : "code",
    });
  },

  toggleLeft: (editor: Editor) => {
    Transforms.setNodes(editor, {
      align: "left",
    });
  },

  toggleCenter: (editor: Editor) => {
    const [isCenter] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.align === "center",
    });

    Transforms.setNodes(editor, {
      align: isCenter ? "left" : "center",
    });
  },

  toggleRight: (editor: Editor) => {
    const [isRight] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.align === "right",
    });

    Transforms.setNodes(editor, {
      align: isRight ? "left" : "right",
    });
  },

  toggleJustify: (editor: Editor) => {
    const [isJustify] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.align === "justify",
    });

    Transforms.setNodes(editor, {
      align: isJustify ? "left" : "justify",
    });
  },

  toggleBold: (editor: Editor) => {
    const [isBold] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n.bold !== undefined && n.bold === true,
    });

    Transforms.setNodes(
      editor,
      { bold: !isBold },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleItalic: (editor: Editor) => {
    const [isItalic] = Editor.nodes(editor, {
      match: (n) =>
        Text.isText(n) && n.italic !== undefined && n.italic === true,
    });

    Transforms.setNodes(
      editor,
      { italic: !isItalic },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleUnderline: (editor: Editor) => {
    const [isUnderline] = Editor.nodes(editor, {
      match: (n) =>
        Text.isText(n) && n.underline !== undefined && n.underline === true,
    });

    Transforms.setNodes(
      editor,
      { underline: !isUnderline },
      { match: (n) => Text.isText(n), split: true }
    );
  },
};
