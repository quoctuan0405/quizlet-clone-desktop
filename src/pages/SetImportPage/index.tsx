import { useRef, useState } from "react";
import { useFileUpload } from "../../features/Dropzone/hooks/useFileUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Variants, motion } from "framer-motion";
import classNames from "classnames";
import { Descendant } from "slate";
import { SetCreate } from "../../entities/SetCreate";

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

export interface Set {
  name: string;
  description?: string;
  terms: Term[];
}

export interface Term {
  id: string;
  index?: number;
  question: string | Descendant[];
  answer: string | Descendant[];
  explanation?: string | Descendant[];
}

export const SetImportPage: React.FC = () => {
  const [set, setSet] = useState<Set>();
  const [isFileOver, setIsFileOver] = useState<boolean>(false);

  const { inputFileHandler, dragLeaveHandler, dragOverHandler, dropHandler } =
    useFileUpload({
      fileDropHandler: () => {
        setIsFileOver(false);
      },
      fileLeaveHandler(event) {
        setIsFileOver(false);
      },
      fileOverHandler(event) {
        setIsFileOver(true);
      },
      fileUploadHandler(sets) {
        if (sets.length !== 0) {
          setSet(sets[0]);
        }
      },
    });

  const inputFileRef = useRef<HTMLInputElement>(null);

  const fileHoverClass = classNames({
    "bg-purple-200/80 dark:bg-purple-950 shadow-inner": isFileOver,
  });

  return (
    <>
      {set !== undefined ? (
        <div className="p-10">
          <SetCreate set={set} />
        </div>
      ) : (
        <motion.div
          className={`flex flex-col flex-wrap items-center justify-center w-full h-full group cursor-pointer duration-200 ${fileHoverClass}`}
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={listAnimation}
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
          onDragLeave={dragLeaveHandler}
          onClick={() => {
            inputFileRef?.current?.click();
          }}
        >
          <input
            ref={inputFileRef}
            hidden
            type="file"
            onChange={inputFileHandler}
          />
          <motion.div variants={itemAnimation}>
            <FontAwesomeIcon
              icon={faFileArrowUp}
              className={
                "w-52 h-52 text-purple-400/70 group-hover:text-purple-400/80 dark:text-purple-700/50 dark:group-hover:text-purple-700/70 duration-150"
              }
            />
          </motion.div>
          <motion.p
            className="mt-10 lg:mt-14 text-2xl lg:text-3xl font-bold text-purple-500/60 group-hover:text-purple-500/80 duration-150"
            variants={itemAnimation}
          >
            Select file to upload
          </motion.p>
          <motion.p
            className="lg:mt-2 text-lg lg:text-xl text-purple-400/60 group-hover:text-purple-500/60 dark:group-hover:text-purple-500/90 font-semibold duration-150"
            variants={itemAnimation}
          >
            or drag and drop here
          </motion.p>
        </motion.div>
      )}
    </>
  );
};
