import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Variants, motion } from "framer-motion";
import { SearchBox } from "../SearchBox";
import { ListOption } from "./ui/ListOption";
import { AnimationStage } from "./type";

const menuAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 0.97,
  },
};

const searchBoxAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

export interface ItemData {
  id: string;
  name: string;
}

interface Props {
  items?: ItemData[];
  className?: string;
  onItemSelect?: (item: ItemData, index: number) => any;
}

export const Menu: React.FC<Props> = ({ items, className, onItemSelect }) => {
  const [listHeight, setListHeight] = useState<number>();

  const menuRef = useRef<HTMLDivElement>(null);
  const searchboxRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuRef.current && searchboxRef.current && listRef.current) {
      // Menu
      const menuMaxHeight = parseFloat(
        window.getComputedStyle(menuRef.current).maxHeight
      );

      const menuPaddingTop = parseFloat(
        window.getComputedStyle(menuRef.current).paddingTop
      );

      const menuPaddingBottom = parseFloat(
        window.getComputedStyle(menuRef.current).paddingBottom
      );

      // Search box
      const searchboxHeight =
        searchboxRef.current?.getBoundingClientRect().height;

      // List
      const listMarginTop = parseFloat(
        window.getComputedStyle(listRef.current).marginTop
      );

      // Calculate max list height
      setListHeight(
        menuMaxHeight -
          menuPaddingTop -
          menuPaddingBottom -
          searchboxHeight -
          listMarginTop
      );
    }
  }, [menuRef.current, searchboxRef.current]);

  const MotionSearchBox = useMemo(() => motion(SearchBox), []);

  return (
    <motion.div
      ref={menuRef}
      className={`block z-30 px-2 py-3 shadow-lg rounded-lg bg-white dark:bg-gradient-to-b dark:from-purple-900 dark:to-purple-900 max-w-fit ${className}`}
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
      variants={menuAnimation}
    >
      <MotionSearchBox ref={searchboxRef} variants={searchBoxAnimation} />
      {items ? (
        <ListOption
          ref={listRef}
          style={{
            maxHeight:
              listHeight && !isNaN(listHeight) ? listHeight : undefined,
          }}
          items={items}
          onItemSelect={onItemSelect}
        />
      ) : null}
    </motion.div>
  );
};
