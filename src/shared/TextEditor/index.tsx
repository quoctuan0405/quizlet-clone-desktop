// Import React dependencies.
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// Import the Slate editor factory.
import { createEditor, Editor, Transforms, Descendant } from "slate";
import {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from "slate-react";
import { withHistory } from "slate-history";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";
import { Leaf } from "./ui/Leaf";
import { AnimatePresence, useForceUpdate } from "framer-motion";
import { Toolbar } from "./ui/Toolbar";
import { Align, CustomEditor } from "./model/CustomEditor";
import classNames from "classnames";
import { convertToListDescendant } from "./util/convertToListDescendant";
import { Element } from "./ui/Element";
import { Placeholder } from "./ui/Placeholder";

interface Props {
  forceRerenderKey?: any;
  placeholder?: string;
  initialValue?: Descendant[] | string | number | boolean;
  readOnly?: boolean;
  align?: Align;
  onChange?: (value: Descendant[]) => any;
  onBlur?: React.FocusEventHandler<HTMLDivElement> | undefined;
}

export const TextEditor: React.FC<Props> = ({
  forceRerenderKey,
  placeholder,
  readOnly = false,
  align = "left",
  initialValue = [
    {
      type: "paragraph",
      align: "left",
      children: [{ text: "" }],
    },
  ],
  onChange,
  onBlur,
  ...rest
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [savedValue, setSavedValue] = useState<Descendant[]>(
    convertToListDescendant(initialValue, { align })
  );
  const [forceUpdate] = useForceUpdate();
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    return <Element {...props} />;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const renderPlaceholder = useCallback((props: RenderPlaceholderProps) => {
    return <Placeholder {...props} />;
  }, []);

  const editorClassName = classNames({
    [`rounded-lg px-3 py-2 lg:px-4 lg:py-2 bg-white/50 dark:bg-purple-800/50 dark:hover:brightness-110 dark:text-white ${
      isFocus
        ? "outline-purple-400 dark:outline-none dark:brightness-110 dark:border-purple-600 dark:border-2"
        : "outline-none hover:outline-purple-300 dark:hover:outline-none dark:hover:border-purple-700 dark:border-transparent dark:border-2"
    } duration-100`]: readOnly === false,
    [`bg-opacity-0`]: readOnly === true,
  });

  useEffect(() => {
    if (readOnly) {
      // Delete all entries leaving 1 empty node
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });

      // Removes empty node
      Transforms.removeNodes(editor, {
        at: [0],
      });

      // Insert array of children nodes
      Transforms.insertNodes(
        editor,
        convertToListDescendant(savedValue, { align })
      );
    }
  }, [align]);

  useEffect(() => {
    if (readOnly) {
      // Delete all entries leaving 1 empty node
      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });

      // Removes empty node
      Transforms.removeNodes(editor, {
        at: [0],
      });

      // Insert array of children nodes
      Transforms.insertNodes(
        editor,
        convertToListDescendant(initialValue, { align })
      );
    }
  }, [forceRerenderKey]);

  return (
    <Slate
      editor={editor}
      initialValue={savedValue}
      onChange={(value) => {
        readOnly && setSavedValue(value);
        onChange && onChange(value);
      }}
    >
      <AnimatePresence>
        {isFocus && <Toolbar editor={editor} forceUpdate={forceUpdate} />}
      </AnimatePresence>

      <Editable
        className={editorClassName}
        readOnly={readOnly}
        placeholder={placeholder}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        renderPlaceholder={renderPlaceholder}
        onFocus={() => {
          // Bug not focus on when tabbing (see issue #3634: https://github.com/ianstormtaylor/slate/issues/3634)
          // It seems that the state change (isFocus) make the Editable component immediately rerender which make the focus does not work
          // Workaround by delay state change by 50ms
          timerRef.current = setTimeout(() => {
            setIsFocus(true);
          }, 50);
        }}
        onBlur={(event) => {
          setIsFocus(false);
          onBlur && onBlur(event);
        }}
        onKeyDown={(event) => {
          // Handling esc key
          if (event.key === "Escape") {
            event.currentTarget.blur();
          }

          // Handling paragraph style
          if (!event.ctrlKey) {
            return;
          }

          switch (event.key) {
            case "`":
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
              forceUpdate();
              break;

            case "b":
              event.preventDefault();
              CustomEditor.toggleBold(editor);
              forceUpdate();
              break;

            case "i":
              event.preventDefault();
              CustomEditor.toggleItalic(editor);
              forceUpdate();
              break;

            case "u":
              event.preventDefault();
              CustomEditor.toggleUnderline(editor);
              forceUpdate();
              break;

            case "l":
              event.preventDefault();
              CustomEditor.toggleLeft(editor);
              forceUpdate();
              break;

            case "e":
              event.preventDefault();
              CustomEditor.toggleCenter(editor);
              forceUpdate();
              break;

            case "r":
              event.preventDefault();
              CustomEditor.toggleRight(editor);
              forceUpdate();
              break;

            case "j":
              event.preventDefault();
              CustomEditor.toggleJustify(editor);
              forceUpdate();
              break;
          }
        }}
        {...rest}
      />
    </Slate>
  );
};
