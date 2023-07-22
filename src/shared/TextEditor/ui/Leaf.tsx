import { RenderLeafProps } from "slate-react";

export const Leaf: React.FC<RenderLeafProps> = (props) => {
  let children = props.children;

  if (props.leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (props.leaf.italic) {
    children = <em>{children}</em>;
  }

  if (props.leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span
      className="text-slate-500/90 dark:text-purple-200 font-semibold"
      {...props.attributes}
    >
      {children}
    </span>
  );
};
