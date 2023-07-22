import { RenderElementProps } from "slate-react";

export const Element: React.FC<RenderElementProps> = (props) => {
  const style: React.CSSProperties = {
    textAlign: props.element.align ?? "left",
  };

  switch (props.element.type) {
    case "code":
      return (
        <pre {...props.attributes} style={style}>
          <code>{props.children}</code>
        </pre>
      );
    default:
      return (
        <div {...props.attributes} style={style}>
          {props.children}
        </div>
      );
  }
};
