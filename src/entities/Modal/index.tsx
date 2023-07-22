import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface Props {
  children: React.ReactNode;
  onClose?: () => any;
}

export const Modal: React.FC<Props> = ({ children, onClose }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  return ReactDOM.createPortal(
    <div className="z-50">
      <div className="fixed z-50 inset-0 backdrop-blur"></div>
      <div className="fixed z-50 inset-0">{children}</div>
    </div>,
    document.querySelector("#modal-container") as Element
  );
};
