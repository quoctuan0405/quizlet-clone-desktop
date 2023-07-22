import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Variants, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const listButtonAnimation: Variants = {
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

const buttonAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

type InnerShadow = "left" | "right";

interface Item {
  id: string;
  name: string;
}

interface Props {
  items: Item[];
  onItemChangeHandler: (item: Item, index: number) => void;
}

export const TabButtons: React.FC<Props> = ({ onItemChangeHandler, items }) => {
  const [selectItemId, setSelectedItemId] = useState<string>(items[0].id);

  const [layoutId, setLayoutId] = useState<string>(uuidv4());
  const [innerShadows, setInnerShadows] = useState<InnerShadow[]>([]);

  const getInnerShadowStyle = useCallback(() => {
    if (innerShadows.length == 0) {
      return undefined;
    }

    let styles: string[] = [];
    for (let i = 0; i < innerShadows.length; i++) {
      switch (innerShadows[i]) {
        case "left":
          styles.push("inset 10px -3px 3px -7px rgba(0,0,0,0.1)");
          break;

        case "right":
          styles.push("inset -10px -3px 3px -7px rgba(0,0,0,0.1)");
          break;
      }
    }

    let style = "";
    for (let i = 0; i < styles.length; i++) {
      if (i === 0) {
        style += styles[i];
      } else {
        style += `, ${styles[i]}`;
      }
    }

    return style;
  }, []);

  const ref = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      // Using timeout to wait after animation
      const id = setTimeout(() => {
        const maxScrollValue =
          ref.current!.scrollWidth - ref.current!.clientWidth;

        const newInnerShadows: InnerShadow[] = [];
        if (ref.current!.scrollLeft > 20) {
          newInnerShadows.push("left");
        }

        if (ref.current!.scrollLeft < maxScrollValue - 20) {
          newInnerShadows.push("right");
        }

        setInnerShadows(newInnerShadows);
      }, items.length * 50);

      return () => clearTimeout(id);
    }
  }, []);

  return (
    <div className="text-base font-medium text-center text-slate-500">
      <motion.ul
        ref={ref}
        className="flex flex-row overflow-auto scrollbar-hide"
        style={{
          boxShadow: getInnerShadowStyle(),
        }}
        onScroll={(e) => {
          const maxScrollValue =
            e.currentTarget.scrollWidth - e.currentTarget.clientWidth;

          const newInnerShadows: InnerShadow[] = [];
          if (e.currentTarget.scrollLeft > 20) {
            newInnerShadows.push("left");
          }

          if (e.currentTarget.scrollLeft < maxScrollValue - 20) {
            newInnerShadows.push("right");
          }

          setInnerShadows(newInnerShadows);
        }}
        initial={"hidden"}
        animate={"visible"}
        variants={listButtonAnimation}
      >
        {items.map((category, index) => (
          <motion.li
            key={category.id}
            className="px-4 py-2 min-w-fit relative cursor-pointer border-b-2 "
            variants={buttonAnimation}
            onClick={() => {
              if (category.id === selectItemId) {
                return;
              }

              setSelectedItemId(category.id);
              onItemChangeHandler(category, index);
            }}
          >
            <p
              className={`hover:text-slate-700 hover:border-slate-400 duration-100 first-letter ${
                category.id === selectItemId ? "text-sky-500" : undefined
              } `}
            >
              {category.name}
            </p>
            {category.id === selectItemId ? (
              <motion.div
                className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-sky-500"
                layoutId={layoutId}
              ></motion.div>
            ) : null}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};
