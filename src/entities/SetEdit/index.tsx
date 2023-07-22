import { Descendant } from "slate";
import { ListEditTerm, ListTerm } from "../ListEditTerm";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { convertToListTermFormValue } from "./model/convertToListTermFormValue";
import { TextBox } from "../../shared/TextBox";
import { Button } from "../../shared/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSetByIdQuery } from "../../providers/operation/queries";
import { updateSetMutation } from "../../providers/operation/mutations";
import { useNavigate } from "react-router-dom";
import { Variants, motion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { isListDescendantEmpty } from "../../shared/TextEditor/util/isListDescendantEmpty";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

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

export interface SetDataFormValue extends ListTerm {
  id: string;
  name: string;
  description?: string;
}

export interface Term {
  id: string;
  index?: number;
  question: string | Descendant[];
  answer: string | Descendant[];
  explanation?: string | Descendant[];
}

export interface Set {
  id: string;
  name: string;
  description?: string;
  terms: Term[];
}

interface Props {
  set?: Set;
}

export const SetEdit: React.FC<Props> = ({ set }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate, isSuccess, data } = useMutation({
    ...updateSetMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(getSetByIdQuery(set?.id || "").queryKey);
    },
  });

  const { control, handleSubmit, setValue } = useForm<SetDataFormValue>({});

  const onSubmit: SubmitHandler<SetDataFormValue> = (data) => {
    // Convert empty explanation to undefined
    for (let term of data.terms) {
      if (term && term.explanation && isListDescendantEmpty(term.explanation)) {
        term.explanation = undefined;
      }
    }

    mutate(data);
  };

  useEffect(() => {
    if (set) {
      setValue("id", set.id);
      setValue("terms", convertToListTermFormValue(set.terms));
      setValue("name", set.name);
      setValue("description", set.description);
    }
  }, [set]);

  useEffect(() => {
    if (data && isSuccess) {
      navigate(`/set/${data?.id}`);
    }
  }, [data, isSuccess]);

  useHotkeys(
    "ctrl + s",
    () => {
      handleSubmit(onSubmit)();
    },
    {
      enableOnFormTags: ["INPUT", "input"],
    }
  );

  return (
    <div>
      <div className="w-full flex flex-row flex-wrap">
        <motion.div
          className="flex flex-col flex-wrap space-y-3"
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={listAnimation}
        >
          <motion.div variants={itemAnimation}>
            <Controller
              name={`name`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextBox
                  className="w-80 font-semibold text-base lg:text-lg"
                  placeholder="Set name"
                  value={value || ""}
                  onChange={onChange}
                />
              )}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <Controller
              name={`description`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextBox
                  className="w-80 font-semibold text-base lg:text-lg"
                  placeholder="Description"
                  value={value || ""}
                  onChange={onChange}
                />
              )}
            />
          </motion.div>
        </motion.div>
        <motion.div className="ml-auto pt-2" variants={itemAnimation}>
          <Button
            variant="colorful"
            className="w-28 h-9 mt-1.5"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            <div className="flex flex-row flex-wrap items-center justify-center space-x-3">
              <p className="font-semibold text-base">Save</p>
            </div>
          </Button>
        </motion.div>
      </div>
      <div className="mt-10 pb-10">
        {set?.terms && set.terms.length !== 0 ? (
          <ListEditTerm control={control} terms={set.terms} />
        ) : null}
      </div>
    </div>
  );
};
