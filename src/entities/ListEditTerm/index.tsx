import { useEffect, useState } from "react";
import { Descendant } from "slate";
import { useFieldArray, Control, FieldArrayWithId } from "react-hook-form";
import { AnimatePresence, Reorder, Variants, motion } from "framer-motion";
import { DraggableEditItem } from "./ui/DraggableEditTerm";
import { AnimationStage } from "./ui/type";
import { Button } from "../../shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { isEmpty } from "../../shared/TextEditor/model/isEmpty";
import { newEmptyEditTerm } from "./hooks/newEmptyEditTerm";
import { useHotkeys } from "react-hotkeys-hook";

const delay = 0.1;

const listAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

export interface Term {
  id?: string;
  index?: number;
  question: string | Descendant[];
  answer: string | Descendant[];
  explanation?: string | Descendant[];
}

export interface ListTerm {
  terms: Term[];
}

interface Props<T extends ListTerm> {
  control: Control<T, any>;
  terms?: Term[];
}

export const ListEditTerm = <T extends ListTerm>({
  control,
  terms,
}: Props<T>) => {
  const { unregister } = control as unknown as Control<ListTerm>;

  const [updatedTerms, setUpdatedTerms] = useState<Term[]>(terms || []);

  useEffect(() => {
    setUpdatedTerms(terms || []);
  }, [terms]);

  // On remove and on add
  const onRemove = (index: number) => {
    setUpdatedTerms(updatedTerms.filter((_, termIndex) => termIndex !== index));

    unregister(`terms.${index}.id`);
    unregister(`terms.${index}.index`);
    unregister(`terms.${index}.question`);
    unregister(`terms.${index}.answer`);
    unregister(`terms.${index}.explanation`);
    unregister(`terms.${index}`);
  };

  const onAdd = () => {
    setUpdatedTerms([
      ...updatedTerms,
      {
        id: uuidv4(),
        index: updatedTerms.length,
        question: [
          {
            type: "paragraph",
            align: "left",
            children: [{ text: "" }],
          },
        ],
        answer: [
          {
            type: "paragraph",
            align: "left",
            children: [{ text: "" }],
          },
        ],
        explanation: [
          {
            type: "paragraph",
            align: "left",
            children: [{ text: "" }],
          },
        ],
      },
    ]);
  };

  useHotkeys(
    "ctrl + -",
    () => {
      onRemove(updatedTerms.length - 1);
    },
    {
      enableOnFormTags: ["INPUT", "input"],
    }
  );

  useHotkeys(
    "ctrl + =",
    () => {
      onAdd();
    },
    {
      enableOnFormTags: ["INPUT", "input"],
    }
  );

  return (
    <>
      {updatedTerms.length !== 0 ? (
        <Reorder.Group
          className="flex flex-column flex-wrap"
          axis="y"
          values={updatedTerms}
          onReorder={(items) => {
            setUpdatedTerms(items.map((item, index) => ({ ...item, index })));
          }}
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          exit={AnimationStage.HIDDEN}
          variants={listAnimation}
        >
          <AnimatePresence>
            {updatedTerms.length !== 0 &&
              updatedTerms.map((term, index) => (
                <DraggableEditItem
                  key={term.id}
                  index={index}
                  control={control as unknown as Control<ListTerm, any>}
                  term={term}
                  onRemove={() => {
                    onRemove(index);
                  }}
                />
              ))}
          </AnimatePresence>
        </Reorder.Group>
      ) : null}
      <motion.div
        className="w-full"
        initial={AnimationStage.HIDDEN}
        animate={AnimationStage.VISIBLE}
        exit={AnimationStage.HIDDEN}
        transition={{
          delay,
        }}
        variants={itemAnimation}
      >
        <Button
          variant="colorful"
          className="w-full max-w-full"
          onClick={() => {
            onAdd();
          }}
        >
          <div className="flex flex-row flex-wrap items-center justify-center m-2">
            <FontAwesomeIcon
              icon={faAdd}
              className="text-white text-opacity-90 text-lg"
            />
            <p className="font-bold text-white text-opacity-90 ml-3">
              Add term
            </p>
          </div>
        </Button>
      </motion.div>
    </>
  );
};
