import React, { useRef, useEffect } from "react";

function useOutsideAlerter(ref: any, handleOutsideClick: () => void) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleOutsideClick();
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
}

export function OutsideAlerter(props: any) {
  const wrapperRef = useRef(null);

  const handleOutsideClick = () => {
    props.handleOutsideClick();
  };

  useOutsideAlerter(wrapperRef, handleOutsideClick);

  return <div ref={wrapperRef}>{props.children}</div>;
}
