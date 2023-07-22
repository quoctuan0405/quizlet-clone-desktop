import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../../shared/Button";
import { Variants, motion } from "framer-motion";
import { Fireworks, FireworksHandlers } from "@fireworks-js/react";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetLearningMutation } from "../../providers/operation/mutations";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const duration = 0.5;

const circleAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    display: "none",
    width: 0,
    height: 0,
    transition: {
      duration,
    },
  },
  [AnimationStage.VISIBLE]: {
    display: "block",
    width: ["0rem", "31rem", "30rem"],
    height: ["0rem", "31rem", "30rem"],
    transition: {
      duration,
    },
  },
};

const listAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      delayChildren: duration,
      duration,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: duration,
      duration,
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

interface Props {
  setId?: string;
}

export const CongratulationComplete: React.FC<Props> = ({ setId }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({ ...resetLearningMutation(queryClient) });

  const ref = useRef<FireworksHandlers>(null);

  return (
    <motion.div className="flex flex-wrap items-center justify-center w-full h-full select-none">
      <Fireworks
        ref={ref}
        options={{ opacity: 0.9, mouse: { click: true } }}
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          position: "fixed",
        }}
      />
      <motion.div
        className="bg-white dark:bg-purple-700/70 rounded-full shadow-sm"
        initial={[AnimationStage.HIDDEN]}
        animate={[AnimationStage.VISIBLE]}
        variants={circleAnimation}
      >
        <motion.div
          className="flex flex-col flex-wrap items-center justify-center w-full h-full"
          initial={[AnimationStage.HIDDEN]}
          animate={[AnimationStage.VISIBLE]}
          exit={AnimationStage.HIDDEN}
          variants={listAnimation}
        >
          <motion.div variants={itemAnimation}>
            <FontAwesomeIcon
              icon={faTrophy}
              className="text-9xl text-purple-500 dark:text-purple-100/80 drop-shadow"
            />
          </motion.div>
          <motion.p
            className="mt-6 font-black dark:font-bold text-3xl text-purple-600 dark:text-purple-100"
            variants={itemAnimation}
          >
            Congratulation!
          </motion.p>
          <motion.p
            className="mt-2 font-bold dark:font-bold text-xl text-purple-500 dark:text-purple-100/80"
            variants={itemAnimation}
          >
            You've completed!
          </motion.p>
          <motion.div variants={itemAnimation}>
            <Button
              variant="colorful"
              className="mt-10 w-48 h-10"
              onClick={() => setId && mutate({ setId })}
            >
              <div className="font-semibold text-base">Learn again!</div>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
