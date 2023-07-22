import { Reorder, Variants, motion, useDragControls } from "framer-motion";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormReturn,
} from "react-hook-form";
import { EditTerm } from "../../EditTerm";
import { TextEditor } from "../../../shared/TextEditor";
import { ListTerm, Term } from "..";
import { AnimationStage } from "./type";
import { useEffect } from "react";

const termAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.3,
    },
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: {
      duration: 0.3,
    },
  },
};

interface Props<T extends ListTerm> {
  index: number;
  term: Term;
  control: Control<T, any>;
  onRemove?: () => any;
}

export const DraggableEditItem = <T extends ListTerm>({
  index,
  term,
  control,
  onRemove,
}: Props<T>) => {
  const { register } = control as unknown as Control<ListTerm>;

  const dragControls = useDragControls();

  return (
    <Reorder.Item
      key={term.id}
      value={term}
      className="w-full mb-5"
      dragListener={false}
      dragControls={dragControls}
      variants={termAnimation}
    >
      <input
        type="hidden"
        value={index}
        {...register(`terms.${index}.index`, { valueAsNumber: true })}
      />
      <input type="hidden" value={term.id} {...register(`terms.${index}.id`)} />
      <EditTerm
        key={term.id}
        index={index}
        dragControl={dragControls}
        questionEditor={
          <Controller
            name={`terms.${index}.question`}
            control={control as unknown as Control<ListTerm, any>}
            defaultValue={term.question}
            shouldUnregister
            render={({ field: { onChange, onBlur } }) => (
              <TextEditor
                placeholder="Term"
                initialValue={term.question}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        }
        answerEditor={
          <Controller
            name={`terms.${index}.answer`}
            control={control as unknown as Control<ListTerm, any>}
            defaultValue={term.answer}
            shouldUnregister
            render={({ field: { onChange, onBlur } }) => (
              <TextEditor
                placeholder="Definition"
                initialValue={term.answer}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        }
        explanationEditor={
          <Controller
            name={`terms.${index}.explanation`}
            control={control as unknown as Control<ListTerm, any>}
            defaultValue={term.explanation}
            shouldUnregister
            render={({ field: { onChange, onBlur } }) => (
              <TextEditor
                placeholder="Explanation"
                initialValue={term.explanation}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        }
        onRemove={() => {
          onRemove && onRemove();
        }}
      />
    </Reorder.Item>
  );
};
