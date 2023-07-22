import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useMergeRef } from "../../hooks/useMergeRef";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
}

export const TextBox = React.forwardRef<HTMLInputElement, Props>(
  (
    { value, type, className, placeholder, onChange, ...rest },
    ref: React.Ref<any>
  ) => {
    const [isEmpty, setIsEmpty] = useState<boolean>(
      () => value === "" || value === undefined || value === null
    );

    useEffect(() => {
      setIsEmpty(() => value === "" || value === undefined || value === null);
    }, [value]);

    return (
      <>
        {type === "hidden" ? (
          <input type="hidden" ref={ref} />
        ) : (
          <div className={`${className}`}>
            <div className={`relative mt-3`}>
              <input
                ref={ref}
                className={`peer block text-purple-600 min-h-[auto] w-full rounded border-0 bg-transparent px-0 pt-[0.5rem] pb-[0.2rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary`}
                value={value}
                onChange={(e) => {
                  if (e.currentTarget?.value && e.currentTarget.value !== "") {
                    setIsEmpty(false);
                  } else {
                    setIsEmpty(true);
                  }

                  if (onChange) {
                    onChange(e);
                  }
                }}
                {...rest}
              />
              <label
                className={`pointer-events-none absolute left-0 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] font-medium text-purple-400 transition-all duration-200 ease-out ${
                  !isEmpty &&
                  "translate-y-[-1.2rem] scale-[0.8] text-purple-400"
                } peer-focus:-translate-y-[1.2rem] peer-focus:scale-[0.8] peer-focus:text-purple-400 motion-reduce:transition-none dark:text-purple-200/80 dark:peer-focus:text-primary`}
              >
                {placeholder}
              </label>
              <div
                className={`h-px w-full bg-purple-400 absolute left-0 bottom-0 peer peer-hover:h-0.5 ${
                  !isEmpty && "bg-purple-400 h-0.5"
                } peer-focus:bg-purple-400 peer-focus:h-0.5 duration-100 ease-out transition-all`}
              ></div>
            </div>
          </div>
        )}
      </>
    );
  }
);
