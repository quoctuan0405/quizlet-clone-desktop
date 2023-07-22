import { Variants, motion } from "framer-motion";
import { Flashcard } from "../Flashcard";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const listAnimation: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
  visible: {
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

interface Set {
  id: string;
  name: string;
  termCount: number;
}

interface Props {
  sets?: Set[];
  delay?: number;
}

export const ListFlashcard: React.FC<Props> = ({ sets, delay = 0 }) => {
  return (
    <>
      {sets && sets.length !== 0 && (
        <motion.div
          className="flex flex-wrap"
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          exit={AnimationStage.HIDDEN}
          transition={{ delay }}
          variants={listAnimation}
        >
          {sets.map((set) => (
            <motion.div key={set.id} variants={itemAnimation}>
              <Flashcard set={set} className="w-60 h-36 mb-3 mr-3" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};
