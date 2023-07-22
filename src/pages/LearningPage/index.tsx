import { useParams } from "react-router-dom";
import { LearningCard } from "../../features/LearningCard";
import { Params } from "./type";
import { Progress } from "../../entities/Progress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getLearningProgressQuery } from "../../providers/operation/queries";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { CongratulationComplete } from "../../entities/CongratulationComplete";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    y: 30,
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    y: 0,
    opacity: 1,
  },
};

export const LearningPage = () => {
  const { setId } = useParams<Params>();

  const { data: learningProgress } = useQuery({
    ...getLearningProgressQuery(setId || ""),
    enabled: setId !== null && setId !== undefined,
  });

  return (
    <>
      {learningProgress?.termsMastered === learningProgress?.termsTotal ? (
        <CongratulationComplete setId={setId} />
      ) : (
        <AnimatePresence>
          <div className="px-10 py-5 w-full h-full">
            <div className="flex flex-row flex-wrap space-x-10">
              <motion.div
                className="flex-grow"
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                variants={animation}
              >
                <Progress
                  variant="indigo"
                  icon={<FontAwesomeIcon icon={faBookOpen} />}
                  currentProgressText={`${
                    learningProgress?.termsLearned || 0
                  } terms`}
                  description="Learning..."
                  progress={
                    learningProgress &&
                    learningProgress.termsLearned / learningProgress.termsTotal
                  }
                />
              </motion.div>
              <motion.div
                className="flex-grow"
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                variants={animation}
              >
                <Progress
                  variant="purple"
                  icon={<FontAwesomeIcon icon={faGraduationCap} />}
                  currentProgressText={`${
                    learningProgress?.termsMastered || 0
                  } terms`}
                  description="Master"
                  progress={
                    learningProgress &&
                    learningProgress.termsMastered / learningProgress.termsTotal
                  }
                />
              </motion.div>
            </div>
            <motion.div
              className="mt-7 w-full"
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              transition={{ delay: 0.15 }}
              variants={animation}
            >
              <LearningCard setId={setId} />
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </>
  );
};
