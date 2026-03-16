import { useCallback, useEffect, useState } from "react";

export function useDoorHoverState() {
  const [isHoverActive, setIsHoverActive] = useState(false);

  const activateHover = useCallback(() => {
    setIsHoverActive(true);
  }, []);

  const deactivateHover = useCallback(() => {
    setIsHoverActive(false);
  }, []);

  useEffect(() => {
    const handleWindowBlur = () => setIsHoverActive(false);
    const handleVisibilityChange = () => {
      if (document.hidden) setIsHoverActive(false);
    };

    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return {
    isHoverActive,
    deactivateHover,
    hoverBindings: {
      onPointerEnter: activateHover,
      onPointerLeave: deactivateHover,
      onPointerCancel: deactivateHover,
      onMouseLeave: deactivateHover,
      onFocus: activateHover,
      onBlur: deactivateHover,
    },
  };
}
