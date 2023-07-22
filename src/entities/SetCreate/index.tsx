import { ListEditTerm, ListTerm, Term } from "../ListEditTerm";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { TextBox } from "../../shared/TextBox";
import { Button } from "../../shared/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSetMutation } from "../../providers/operation/mutations";
import { newEmptyEditTerm } from "../ListEditTerm/hooks/newEmptyEditTerm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { isListDescendantEmpty } from "../../shared/TextEditor/util/isListDescendantEmpty";
import { Variants, motion } from "framer-motion";
import { Dropzone } from "../../features/Dropzone";

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
  name: string;
  description?: string;
}

const defaultTerms = [
  newEmptyEditTerm(0),
  newEmptyEditTerm(1),
  newEmptyEditTerm(2),
];

export interface Set {
  name: string;
  description?: string;
  terms: Term[];
}

interface Props {
  set?: Set;
}

export const SetCreate: React.FC<Props> = ({ set }) => {
  const [terms, setTerms] = useState<Term[]>(
    set?.terms.length === 0 ? defaultTerms : set?.terms || defaultTerms
  );

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate, data, isSuccess } = useMutation({
    ...createSetMutation(queryClient),
  });

  const { control, setValue, handleSubmit } = useForm<SetDataFormValue>({});

  const onSubmit: SubmitHandler<SetDataFormValue> = (data) => {
    // Convert empty explanation to undefined
    for (let term of data.terms) {
      if (term.explanation && isListDescendantEmpty(term.explanation)) {
        term.explanation = undefined;
      }
    }

    mutate(data);
  };

  useEffect(() => {
    if (set) {
      setTerms(set?.terms.length === 0 ? defaultTerms : set?.terms || []);
      setValue("name", set.name);
      setValue("description", set?.description);
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
        <motion.div
          className="flex flex-wrap space-x-3 ml-auto pt-2"
          variants={itemAnimation}
        >
          <Dropzone
            onFileDrop={(sets) => {
              if (sets.length >= 0) {
                const set = sets[0];
                set.name !== "" && setValue("name", set.name);
                set.description !== "" &&
                  setValue("description", set.description);
                setTerms(set.terms);
              }
            }}
          />
          <Button
            variant="colorful"
            className="w-28 h-9 mt-1.5"
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
          >
            <div className="flex flex-row flex-wrap justify-center items-center space-x-3">
              <p className="font-semibold text-base">Save</p>
            </div>
          </Button>
        </motion.div>
      </div>
      <div className="mt-10">
        <ListEditTerm control={control} terms={terms} />
      </div>
    </div>
  );
};
