interface Props {
  className?: string;
  activeClassName?: string;
  active?: boolean;
  children: React.ReactNode;
  onMouseDown: () => any;
}

export const MarkButton: React.FC<Props> = ({
  className,
  activeClassName,
  active,
  children,
  onMouseDown,
  ...rest
}) => {
  return (
    <button
      className={`w-8 h-8 rounded ${
        active
          ? `bg-purple-200 dark:bg-purple-700 ${activeClassName}`
          : `hover:bg-purple-100 dark:hover:bg-purple-800 ${className}`
      } duration-100`}
      tabIndex={-1}
      onMouseDown={(event) => {
        event.preventDefault();

        onMouseDown();
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
