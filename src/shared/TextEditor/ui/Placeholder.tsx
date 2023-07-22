import { RenderPlaceholderProps } from "slate-react";

export const Placeholder: React.FC<RenderPlaceholderProps> = ({
  children,
  attributes,
}) => {
  return (
    <div className="h-full" {...attributes}>
      <div className="h-full flex flex-wrap items-center">
        <p className="text-base font-bold dark:font-semibold text-black/90 dark:text-white">
          {children}
        </p>
      </div>
    </div>
  );
};
