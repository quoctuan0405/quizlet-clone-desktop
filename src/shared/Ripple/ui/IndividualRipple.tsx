import React, { useEffect, useMemo, useState } from "react";
import { Variants, motion } from "framer-motion";
import { Coords } from "..";

interface Props {
  className?: string;
  duration?: number;
  size?: number;
  coords: Coords;
  onComplete?: () => any;
}

enum RippleStage {
  INITIAL = "initial",
  RIPPLE = "ripple",
}

export const IndividualRipple: React.FC<Props> = ({
  className,
  duration = 1200,
  coords,
  size = 50,
  onComplete,
}) => {
  const [isRippling, setIsRippling] = useState(true);

  const rippleAnimation: Variants = useMemo(
    () => ({
      [RippleStage.INITIAL]: {
        scale: 0,
        opacity: 0,
      },
      [RippleStage.RIPPLE]: {
        scale: [1, 2, 5, 6],
        opacity: [1, 0.15, 0.05, 0],
        transition: {
          duration: duration / 1000,
          stiffness: 1,
        },
      },
    }),
    []
  );

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
    } else {
      setIsRippling(false);
    }
  }, []);

  return (
    <motion.div
      className={`absolute -z-10 bg-purple-300 dark:bg-purple-500 opacity-10 block rounded-full ${className}`}
      initial={RippleStage.INITIAL}
      animate={isRippling ? RippleStage.RIPPLE : RippleStage.INITIAL}
      variants={rippleAnimation}
      onAnimationComplete={() => {
        onComplete && onComplete();
      }}
      style={{
        width: size,
        height: size,
        left: coords.x - size / 2,
        top: coords.y - size / 2,
      }}
    ></motion.div>
  );
};
