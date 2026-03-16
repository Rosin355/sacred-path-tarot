import { useCallback, useState } from "react";

export function useDoorHoverState() {
  const [isHoverActive, setIsHoverActive] = useState(false);

  const activateHover = useCallback(() => {
    setIsHoverActive(true);
  }, []);

  const deactivateHover = useCallback(() => {
    setIsHoverActive(false);
  }, []);

  return {
    isHoverActive,
    hoverBindings: {
      onPointerEnter: activateHover,
      onPointerLeave: deactivateHover,
      onFocus: activateHover,
      onBlur: deactivateHover,
    },
  };
}
