import { useEffect, useRef, useState } from "react";
import { Modal } from "../../entities/Modal";
import { Button } from "../../shared/Button";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowDown,
  faFileArrowUp,
  faFileImport,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { readfile } from "./model/readfile";
import { SetWithTermWithId } from "./type";
import { useOpenCloseHotkey } from "../../hooks/useOpenCloseHotkey";
import { useFileUpload } from "./hooks/useFileUpload";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const modalAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 5,
    transition: {
      duration: 0.05,
      stiffness: 10,
    },
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
      stiffness: 10,
    },
  },
};

interface Props {
  onFileDrop?: (sets: SetWithTermWithId[]) => any;
}

export const Dropzone: React.FC<Props> = ({ onFileDrop }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isFileOver, setIsFileOver] = useState<boolean>(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const fileHoverClass = classNames({
    "bg-white dark:bg-purple-900": !isFileOver,
    "bg-purple-100 dark:bg-purple-800 shadow-inner": isFileOver,
  });

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
        onFileDrop && onFileDrop(sets);
        setShowMenu(false);
      },
    });

  const ref = useOpenCloseHotkey({ showMenu, setShowMenu });

  return (
    <div>
      <Button
        className="w-36 h-9 mt-1.5"
        onClick={() => setShowMenu((prevState) => !prevState)}
      >
        <div className="flex flex-wrap items-center justify-center w-full h-full">
          <FontAwesomeIcon icon={faFileImport} className="-ml-1 mr-2" />
          <p className="font-semibold text-white/90">Import set</p>
        </div>
      </Button>

      <AnimatePresence>
        {showMenu && (
          <Modal>
            <div className="flex flex-wrap items-center justify-center p-20 w-full h-full cursor-pointer">
              <motion.div
                ref={ref}
                className={`relative w-full h-full rounded-lg overflow-hidden shadow ${fileHoverClass}`}
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                exit={AnimationStage.HIDDEN}
                variants={modalAnimation}
              >
                <div className="absolute w-full h-full top-0 left-0 z-0 bg-black opacity-0 dark:opacity-30"></div>

                <div className="relative w-full h-full z-10">
                  <div
                    className={`flex flex-col flex-wrap items-center justify-center w-full h-full group cursor-pointer duration-200`}
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
                    <div>
                      <FontAwesomeIcon
                        icon={faFileArrowUp}
                        className={
                          "w-52 h-52 text-purple-400/70 group-hover:text-purple-400/80 dark:text-purple-700/50 dark:group-hover:text-purple-700/70 duration-150"
                        }
                      />
                    </div>
                    <p className="mt-10 lg:mt-14 text-2xl lg:text-3xl font-bold text-purple-500/60 group-hover:text-purple-500/80 duration-150">
                      Select file to upload
                    </p>
                    <p className="lg:mt-2 text-lg lg:text-xl text-purple-400/60 group-hover:text-purple-500/60 dark:group-hover:text-purple-500/90 font-semibold duration-150">
                      or drag and drop here
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
