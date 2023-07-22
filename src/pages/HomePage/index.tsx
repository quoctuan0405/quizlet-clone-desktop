import { useQuery } from "@tanstack/react-query";
import { getSetsQuery } from "../../providers/operation/queries";
import { ListFlashcard } from "../../entities/ListFlashcard";
import { AnimatePresence, Variants, motion } from "framer-motion";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const pageAnimation: Variants = {
  [AnimationStage.HIDDEN]: {},
  [AnimationStage.VISIBLE]: {},
};

export const HomePage = () => {
  const { data: sets } = useQuery({
    ...getSetsQuery(),
  });

  return (
    <AnimatePresence>
      <motion.div
        className="p-5"
        initial={AnimationStage.HIDDEN}
        animate={AnimationStage.VISIBLE}
        exit={AnimationStage.HIDDEN}
        variants={pageAnimation}
      >
        <ListFlashcard sets={sets} delay={0.45} />
      </motion.div>
    </AnimatePresence>
  );
};
