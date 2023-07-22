import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Params } from "./type";
import { useQuery } from "@tanstack/react-query";
import { getSetByIdQuery } from "../../providers/operation/queries";
import { BigFlashcardStack } from "../../entities/BigFlashcardStack";
import { ListTerm } from "../../entities/ListTermCard";
import { Button } from "../../shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilRuler } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { DeleteSetButton } from "../../features/DeleteSetButton";
import { ExportFile } from "../../features/ExportFile";

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

export const SetDetailPage = () => {
  const { setId } = useParams<Params>();
  const { data: set } = useQuery({ ...getSetByIdQuery(setId || "") });

  const [colorStop, setColorStop] = useState<string>("100%");

  const ref = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (ref.current) {
        setColorStop(
          `${(window.innerHeight / ref.current.clientHeight) * 100 - 30}%`
        );
      }
    }, 1000);
  }, [ref.current]);

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        className={`relative bg-gradient-to-b from-transparent to-purple-100/90 dark:to-purple-950 to-[${colorStop}] px-8 pt-7 pb-10`}
        initial={AnimationStage.HIDDEN}
        animate={AnimationStage.VISIBLE}
        exit={AnimationStage.HIDDEN}
        variants={listAnimation}
      >
        <motion.div variants={listAnimation}>
          <motion.div variants={itemAnimation}>
            <p className="font-extrabold text-2xl text-purple-700/80 dark:text-purple-200 drop-shadow-sm shadow-black">
              {set?.name}
            </p>
          </motion.div>
          <motion.p
            className="font-sembold text-base text-purple-700/80 dark:text-purple-200 drop-shadow-sm shadow-black"
            variants={itemAnimation}
          >
            {set?.description}
          </motion.p>
        </motion.div>
        <div className="flex flex-wrap w-full">
          <motion.div
            className="ml-auto flex flex-wrap space-x-3"
            variants={listAnimation}
          >
            <motion.div variants={itemAnimation}>
              <DeleteSetButton setId={setId || ""} />
            </motion.div>
            <motion.div variants={itemAnimation}>
              <Link
                to={`/set/edit/${set?.id}`}
                state={{ prevPath: location.pathname }}
              >
                <Button className="bg-opacity-90 dark:bg-opacity-70">
                  <p className="font-semibold text-sm text-white mx-2 my-1">
                    Edit
                  </p>
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={itemAnimation}>
              <ExportFile set={set} />
            </motion.div>
            <motion.div variants={itemAnimation}>
              <Link
                to={{ pathname: `/set/learning/${set?.id}` }}
                state={{ prevPath: location.pathname }}
              >
                <Button variant="colorful">
                  <div className="flex flex-wrap py-1 px-2">
                    <FontAwesomeIcon
                      icon={faPencilRuler}
                      className="text-white"
                    />
                    <p className="font-semibold text-sm text-white ml-3">
                      Learn
                    </p>
                  </div>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="mt-5"
          transition={{ delay: 0.15 }}
          variants={itemAnimation}
        >
          <BigFlashcardStack terms={set?.terms} />
        </motion.div>
        <motion.div
          className="mt-10"
          transition={{ delay: 0.3 }}
          variants={itemAnimation}
        >
          <ListTerm terms={set?.terms} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
