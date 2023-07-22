import { useState } from "react";
import { Button } from "../../shared/Button";
import { Modal } from "../../entities/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { useOpenCloseHotkey } from "../../hooks/useOpenCloseHotkey";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSetMutation } from "../../providers/operation/mutations";
import { useNavigate } from "react-router-dom";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const modalAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.08,
    },
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
};

interface Props {
  setId: string;
}

export const DeleteSetButton: React.FC<Props> = ({ setId }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({ ...deleteSetMutation(queryClient) });

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const ref = useOpenCloseHotkey({ showMenu, setShowMenu });

  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="tertiary"
        className="bg-opacity-90 dark:bg-opacity-70"
        onClick={() => setShowMenu((prevState) => !prevState)}
      >
        <p className="font-bold dark:font-semibold text-sm text-purple-500/80 dark:text-white/80 mx-2 my-1">
          Delete
        </p>
      </Button>
      <AnimatePresence>
        {showMenu && (
          <Modal>
            <div className="flex flex-wrap items-center justify-center w-full h-full cursor-pointer">
              <motion.div
                ref={ref}
                className="w-[32rem] h-48 p-5 bg-white rounded-lg shadow-lg cursor-auto"
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                exit={AnimationStage.HIDDEN}
                variants={modalAnimation}
              >
                <p className="font-bold text-purple-500 text-xl">
                  <FontAwesomeIcon className="mr-4" icon={faWarning} />
                  Delete this set?
                </p>
                <div className="mt-5">
                  <p className="font-semibold text-purple-400/80 text-base">
                    Don't be worry!
                  </p>
                  <p className="mt-0.5 font-semibold text-purple-400/80 text-base">
                    It's actually just set is_delete to true (aka{" "}
                    <span className="font-extrabold text-purple-500/90">
                      hide
                    </span>{" "}
                    it from your face).
                  </p>
                </div>
                <div className="flex flex-row flex-wrap mt-6 justify-between w-full">
                  <Button
                    variant="tertiary"
                    className="shadow"
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  >
                    <p className="font-bold dark:font-semibold text-purple-500/80 dark:text-white/80 mx-4 my-1">
                      Cancel
                    </p>
                  </Button>
                  <Button
                    className="bg-red-600/70"
                    onClick={() => {
                      mutate({ setId });
                      navigate("/");
                    }}
                  >
                    <p className="font-semibold mx-4 my-1">Delete</p>
                  </Button>
                </div>
              </motion.div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};
