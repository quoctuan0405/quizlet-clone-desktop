import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "../../shared/IconButton";
import {
  faBars,
  faFileCirclePlus,
  faHome,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../shared/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { Variants, motion } from "framer-motion";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

enum AnimationStage {
  MINIMIZE = "minimize",
  MAXIMIZE = "maximize",
}

const sidebarAnimation: Variants = {
  [AnimationStage.MINIMIZE]: {
    width: 63,
  },
  [AnimationStage.MAXIMIZE]: {
    width: 220,
  },
};

const duration = 0.1;

const iconLabelAnimation: Variants = {
  [AnimationStage.MINIMIZE]: {
    width: "auto",
    paddingLeft: 5,
  },
  [AnimationStage.MAXIMIZE]: {
    width: 60,
    paddingLeft: 5,
    transition: {
      duration: duration,
    },
  },
};

const textLabelAnimation: Variants = {
  [AnimationStage.MINIMIZE]: {
    opacity: 0,
    display: "none",
  },
  [AnimationStage.MAXIMIZE]: {
    opacity: 1,
    display: "block",
    transition: {
      delay: duration,
    },
  },
};

interface Props {
  className?: string;
}

export const Sidebar: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMaximize, setIsMaximize] = useState<boolean>(false);

  useHotkeys("ctrl + b", () => {
    setIsMaximize((prevState) => !prevState);
  });

  return (
    <motion.div
      className={`bg-white/70 dark:bg-purple-900 bg-blend-screen dark:bg-blend-multiply shadow ${className}`}
      initial={AnimationStage.MINIMIZE}
      animate={isMaximize ? AnimationStage.MAXIMIZE : AnimationStage.MINIMIZE}
      variants={sidebarAnimation}
    >
      <div className="flex flex-col flex-wrap w-full">
        <div className="p-3 w-full">
          <IconButton
            variant="transparent"
            size="large"
            onClick={() => {
              setIsMaximize((prevState) => !prevState);
            }}
          >
            <FontAwesomeIcon
              icon={faBars}
              className="text-xl text-purple-600/90 dark:text-white/70"
            />
          </IconButton>
        </div>
        <Button
          variant="transparent"
          className={`${
            location.pathname === "/" && "bg-white/60 dark:bg-white/10"
          } hover:bg-white/60 dark:hover:bg-white/10 mt-10`}
          onClick={() => {
            navigate("");
          }}
        >
          <div className="w-full py-3">
            <div className="flex flex-row flex-wrap items-center w-full">
              <motion.div
                className="mt-px mb-1"
                initial={AnimationStage.MINIMIZE}
                animate={
                  isMaximize ? AnimationStage.MAXIMIZE : AnimationStage.MINIMIZE
                }
                variants={iconLabelAnimation}
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className="block mr-auto text-xl text-purple-600/60 dark:text-white/60"
                />
              </motion.div>
              <motion.p
                className="font-bold text-base text-purple-600/80 dark:text-white/60"
                initial={AnimationStage.MINIMIZE}
                animate={
                  isMaximize ? AnimationStage.MAXIMIZE : AnimationStage.MINIMIZE
                }
                variants={textLabelAnimation}
              >
                Home
              </motion.p>
            </div>
          </div>
        </Button>
        <Button
          variant="transparent"
          className={`${
            location.pathname === "/set/create" &&
            "bg-white/60 dark:bg-white/10"
          } hover:bg-white/60 dark:hover:bg-white/10`}
          onClick={() => {
            navigate("set/create");
          }}
        >
          <div className="w-full py-3">
            <div className="flex flex-row flex-wrap items-center w-full">
              <motion.div
                className="mt-px mb-1"
                initial={AnimationStage.MINIMIZE}
                animate={
                  isMaximize ? AnimationStage.MAXIMIZE : AnimationStage.MINIMIZE
                }
                variants={iconLabelAnimation}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="block ml-0.5 mr-auto text-xl text-purple-600/60 dark:text-white/60"
                />
              </motion.div>
              <motion.p
                className="font-bold text-base text-purple-600/80 dark:text-white/60"
                initial={AnimationStage.MINIMIZE}
                animate={
                  isMaximize ? AnimationStage.MAXIMIZE : AnimationStage.MINIMIZE
                }
                variants={textLabelAnimation}
              >
                New set
              </motion.p>
            </div>
          </div>
        </Button>
        <Button
          variant="transparent"
          className={`${
            location.pathname === "/set/import" &&
            "bg-white/60 dark:bg-white/10"
          } hover:bg-white/60 dark:hover:bg-white/10`}
          onClick={() => {
            navigate("set/import");
          }}
        >
          <div className="w-full py-3">
            <div className="flex flex-row flex-wrap items-center w-full">
              <motion.div
                className="mt-px mb-1"
                initial={AnimationStage.MINIMIZE}
                animate={
                  isMaximize ? AnimationStage.MAXIMIZE : AnimationStage.MINIMIZE
                }
                variants={iconLabelAnimation}
              >
                <FontAwesomeIcon
                  icon={faFileCirclePlus}
                  className="block ml-0.5 mr-auto text-xl text-purple-600/60 dark:text-white/60"
                />
              </motion.div>
              <motion.p
                className="font-bold text-base text-purple-600/80 dark:text-white/60"
                initial={AnimationStage.MINIMIZE}
                animate={
                  isMaximize ? AnimationStage.MAXIMIZE : AnimationStage.MINIMIZE
                }
                variants={textLabelAnimation}
              >
                Import
              </motion.p>
            </div>
          </div>
        </Button>
      </div>
    </motion.div>
  );
};
