import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Item as ItemComponent } from "./Option";
import { Variants, motion } from "framer-motion";
import { ItemData } from "..";
import { AnimationStage } from "../type";
import { useMergeRef } from "../../../hooks/useMergeRef";
import { useHoverItemByHotkey } from "../hooks/useHoverItemByHotkey";
import { useHotkeys } from "react-hotkeys-hook";

const listAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      stiffness: 10,
      damping: 10,
    },
  },
};

const itemAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    display: "none",
    opacity: 0,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    display: "block",
    opacity: 1,
    y: 0,
  },
};

interface Props {
  items: ItemData[];
  onItemSelect?: (item: ItemData, index: number) => any;
  className?: string;
  style?: React.CSSProperties;
}

export const ListOption = React.forwardRef<any, Props>(
  ({ items, className, style, onItemSelect }, ref) => {
    const [hoverItemIndex, setHoverItemIndex, containerRef, hoverItemRef] =
      useHoverItemByHotkey(items.length);
    const mergeRef = useMergeRef([containerRef, ref]);

    // Shortcut
    useHotkeys(
      "enter",
      () => {
        if (hoverItemIndex < items.length) {
          onItemSelect && onItemSelect(items[hoverItemIndex], hoverItemIndex);
        }
      },
      { enableOnFormTags: ["INPUT", "input"] }
    );

    const MotionItemComponent = useMemo(() => motion(ItemComponent), []);

    return (
      <motion.div
        ref={mergeRef}
        className={`mt-3 overflow-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-purple-800 scrollbar-thumb-rounded-full flex flex-col ${className}`}
        style={style}
        variants={listAnimation}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={index === hoverItemIndex ? hoverItemRef : null}
            onClick={() => {
              onItemSelect && onItemSelect(item, index);
            }}
          >
            <MotionItemComponent
              className={`${
                index === hoverItemIndex && "bg-purple-100 dark:bg-purple-800"
              }`}
              variants={itemAnimation}
            >
              <p className="block relative z-20 text-base font-semibold text-purple-400 dark:text-purple-200">
                {item.name}
              </p>
            </MotionItemComponent>
          </div>
        ))}
      </motion.div>
    );
  }
);
