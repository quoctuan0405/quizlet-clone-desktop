import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { BehaviorSubject, debounceTime, throttleTime } from "rxjs";
import { IndividualRipple } from "./ui/IndividualRipple";

export interface Coords {
  x: number;
  y: number;
}

interface Props {
  duration?: number;
  rippleKey?: string;
  className?: string;
  size: number;
  coords: Coords;
}

export const Ripple: React.FC<Props> = ({
  rippleKey,
  duration,
  size,
  coords,
  className,
}) => {
  const [rippleList, setRippleList] = useState<string[]>([]);

  // A good example of premature optimization: a user typically can only click at most 8 clicks per second!
  const rippleList$ = useMemo(() => new BehaviorSubject<boolean>(true), []);

  useEffect(() => {
    if (rippleList$) {
      const subs = rippleList$.pipe(throttleTime(120)).subscribe(() => {
        setRippleList((prevState) => {
          const newState = _.clone(prevState);
          newState.push(uuidv4());
          return newState;
        });
      });

      return () => {
        subs.unsubscribe();
      };
    }
  }, [rippleList$]);

  useEffect(() => {
    rippleList$.next(true);
  }, [rippleKey, coords]);

  return (
    <>
      {coords.x !== -1 && coords.y !== -1
        ? rippleList.map((id) => (
            <IndividualRipple
              key={id}
              className={className}
              duration={duration}
              coords={coords}
              size={size}
              onComplete={() => {
                const newRippleList = rippleList.filter(
                  (componentId) => componentId !== id
                );
                setRippleList(newRippleList);
              }}
            />
          ))
        : null}
    </>
  );
};
