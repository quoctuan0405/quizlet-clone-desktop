import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MarkButton } from "../../../shared/MarkButton";
import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { Card } from "../../../shared/Card";
import { Variants, motion } from "framer-motion";
import { useState } from "react";
import { Align } from "../../../shared/TextEditor/model/CustomEditor";

enum SettingAnimationStage {
  INITIAL = "initial",
  ACTIVE = "active",
}

const settingAnimation: Variants = {
  [SettingAnimationStage.INITIAL]: {
    rotate: 0,
  },
  [SettingAnimationStage.ACTIVE]: {
    rotate: 45,
  },
};

enum SettingCardAnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const settingCardAnimation: Variants = {
  [SettingCardAnimationStage.HIDDEN]: {
    height: 0,
    opacity: 0,
    marginTop: 0,
  },
  [SettingCardAnimationStage.VISIBLE]: {
    height: "auto",
    opacity: 1,
    marginTop: 8,
  },
};

interface Props {
  leftAlign?: Align;
  rightAlign?: Align;
  onLeftAlignChange?: (align: Align) => any;
  onRightAlignChange?: (align: Align) => any;
}

export const ControlBar: React.FC<Props> = ({
  leftAlign = "left",
  rightAlign = "left",
  onLeftAlignChange,
  onRightAlignChange,
}) => {
  const [showControlBar, setShowControlBar] = useState<boolean>(false);

  return (
    <>
      <motion.button
        className="ml-auto block hover:brightness-125 focus:outline-none focus:brightness-125 duration-100"
        initial={SettingAnimationStage.INITIAL}
        animate={
          showControlBar
            ? SettingAnimationStage.ACTIVE
            : SettingAnimationStage.INITIAL
        }
        variants={settingAnimation}
        onClick={() => {
          setShowControlBar((prevState) => !prevState);
        }}
      >
        <FontAwesomeIcon
          icon={faCog}
          className="text-2xl text-purple-500/75 dark:text-purple-600/60"
        />
      </motion.button>
      <motion.div
        initial={SettingCardAnimationStage.HIDDEN}
        animate={
          showControlBar
            ? SettingCardAnimationStage.VISIBLE
            : SettingCardAnimationStage.HIDDEN
        }
        variants={settingCardAnimation}
      >
        <Card className="shadow-inner bg-purple-500/5 dark:bg-purple-700/30 p-2">
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-wrap items-center h-fit">
              <MarkButton
                className="dark:hover:bg-purple-700/30"
                activeClassName="bg-purple-200/50 dark:bg-purple-700/50"
                onMouseDown={() => {
                  onLeftAlignChange && onLeftAlignChange("left");
                }}
                active={leftAlign === "left"}
              >
                <FontAwesomeIcon
                  icon={faAlignLeft}
                  className="text-purple-500/50 dark:text-purple-300/70"
                />
              </MarkButton>
              <MarkButton
                className="dark:hover:bg-purple-700/30"
                activeClassName="bg-purple-200/50 dark:bg-purple-700/50"
                onMouseDown={() => {
                  onLeftAlignChange && onLeftAlignChange("center");
                }}
                active={leftAlign === "center"}
              >
                <FontAwesomeIcon
                  icon={faAlignCenter}
                  className="text-purple-500/50 dark:text-purple-300/70"
                />
              </MarkButton>
              <MarkButton
                className="dark:hover:bg-purple-700/30"
                activeClassName="bg-purple-200/50 dark:bg-purple-700/50"
                onMouseDown={() => {
                  onLeftAlignChange && onLeftAlignChange("right");
                }}
                active={leftAlign === "right"}
              >
                <FontAwesomeIcon
                  icon={faAlignRight}
                  className="text-purple-500/50 dark:text-purple-300/70"
                />
              </MarkButton>
            </div>
            <div className="flex flex-wrap items-center h-fit">
              <MarkButton
                className="dark:hover:bg-purple-700/30"
                activeClassName="bg-purple-200/50 dark:bg-purple-700/50"
                onMouseDown={() => {
                  onRightAlignChange && onRightAlignChange("left");
                }}
                active={rightAlign === "left"}
              >
                <FontAwesomeIcon
                  icon={faAlignLeft}
                  className="text-purple-500/50 dark:text-purple-300/70"
                />
              </MarkButton>
              <MarkButton
                className="dark:hover:bg-purple-700/30"
                activeClassName="bg-purple-200/50 dark:bg-purple-700/50"
                onMouseDown={() => {
                  onRightAlignChange && onRightAlignChange("center");
                }}
                active={rightAlign === "center"}
              >
                <FontAwesomeIcon
                  icon={faAlignCenter}
                  className="text-purple-500/50 dark:text-purple-300/70"
                />
              </MarkButton>
              <MarkButton
                className="dark:hover:bg-purple-700/30"
                activeClassName="bg-purple-200/50 dark:bg-purple-700/50"
                onMouseDown={() => {
                  onRightAlignChange && onRightAlignChange("right");
                }}
                active={rightAlign === "right"}
              >
                <FontAwesomeIcon
                  icon={faAlignRight}
                  className="text-purple-500/50 dark:text-purple-300/70"
                />
              </MarkButton>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
};
