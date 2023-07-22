import React, { useEffect, useRef, useState } from "react";
import { Variants, motion } from "framer-motion";
import { Card } from "../../shared/Card";
import { useCoords } from "../../shared/Ripple/hooks/useCoords";
import { v4 as uuidv4 } from "uuid";
import { Ripple } from "../../shared/Ripple";
import { Link, useLocation } from "react-router-dom";

enum AnimationState {
  INITIAL = "initial",
  HOVER = "hover",
}

const backgroundCircleAnimation: Variants = {
  [AnimationState.INITIAL]: {
    scale: 1,
    transition: {
      stiffness: 100,
      duration: 0.2,
    },
  },
  [AnimationState.HOVER]: {
    scale: 1.1,
    transition: {
      stiffness: 100,
      duration: 0.2,
    },
  },
};

const rippleDuration = 2500;

interface Set {
  id: string;
  name: string;
  termCount: number;
}

interface Props {
  className?: string;
  set: Set;
}

export const Flashcard = React.forwardRef<any, Props>(
  ({ className, set }, ref) => {
    const [isHover, setIsHover] = useState<boolean>(false);
    const [coords, calculateAndSetCoords] = useCoords();
    const [forceRippleKey, setForceRippleKey] = useState<string>();

    const location = useLocation();

    return (
      <Link to={`set/${set.id}`} state={{ prevPath: location.pathname }}>
        <Card
          ref={ref}
          className={`relative p-3 hover:brightness-105 shadow-md hover:shadow active:shadow-none cursor-pointer duration-100 overflow-hidden ${className}`}
          variant="colorful"
          onHoverStart={() => setIsHover(true)}
          onHoverEnd={() => setIsHover(false)}
          onClick={(event) => {
            calculateAndSetCoords(event);
            setForceRippleKey(uuidv4());
          }}
        >
          <Ripple
            rippleKey={forceRippleKey}
            className="bg-gradient-radial from-indigo-300 to-purple-200 dark:from-indigo-500 dark:to-purple-500"
            duration={rippleDuration}
            coords={coords}
            size={120}
          />
          <motion.div
            variants={backgroundCircleAnimation}
            animate={isHover ? AnimationState.HOVER : AnimationState.INITIAL}
            className="absolute h-56 w-56 top-7 -right-32 z-0 opacity-20 bg-gradient-radial from-purple-300 to-purple-600 dark:to-purple-500 shadow-2xl rounded-full"
          ></motion.div>
          <p className="text-base text-white dark:text-white/80 font-bold">
            {set.name}
          </p>
          <p className="text-xs text-slate-200 dark:text-slate-300 font-semibold">
            {set.termCount} <span> terms</span>
          </p>
        </Card>
      </Link>
    );
  }
);
