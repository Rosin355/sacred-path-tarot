import { useCallback, useRef, useState } from "react";
import type { DoorData } from "@/components/threshold/ThresholdDoor";

export function useDoorSubtitlePopup() {
  const [hoveredDoorId, setHoveredDoorId] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupClosing, setPopupClosing] = useState(false);
  const [activeSubtitleText, setActiveSubtitleText] = useState<string | null>(null);

  const doorHoveredRef = useRef(false);
  const popupHoveredRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }, []);

  const beginClose = useCallback(() => {
    clearCloseTimer();
    if (!popupVisible || popupClosing) return;
    setPopupClosing(true);
  }, [popupVisible, popupClosing, clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      if (!doorHoveredRef.current && !popupHoveredRef.current) {
        beginClose();
      }
    }, 120);
  }, [beginClose, clearCloseTimer]);

  const onDoorPointerEnter = useCallback(
    (door: DoorData) => {
      doorHoveredRef.current = true;
      clearCloseTimer();

      if (popupClosing) {
        // Re-opening during exit: reset
        setPopupClosing(false);
      }

      setHoveredDoorId(door.id);
      setActiveSubtitleText(door.subtitle);
      setPopupVisible(true);
    },
    [popupClosing, clearCloseTimer]
  );

  const onDoorPointerLeave = useCallback(() => {
    doorHoveredRef.current = false;
    scheduleClose();
  }, [scheduleClose]);

  const onDoorFocus = useCallback(
    (door: DoorData) => {
      doorHoveredRef.current = true;
      clearCloseTimer();
      if (popupClosing) setPopupClosing(false);
      setHoveredDoorId(door.id);
      setActiveSubtitleText(door.subtitle);
      setPopupVisible(true);
    },
    [popupClosing, clearCloseTimer]
  );

  const onDoorBlur = useCallback(() => {
    doorHoveredRef.current = false;
    scheduleClose();
  }, [scheduleClose]);

  const onPopupPointerEnter = useCallback(() => {
    popupHoveredRef.current = true;
    clearCloseTimer();
  }, [clearCloseTimer]);

  const onPopupPointerLeave = useCallback(() => {
    popupHoveredRef.current = false;
    scheduleClose();
  }, [scheduleClose]);

  const onCloseClick = useCallback(() => {
    beginClose();
  }, [beginClose]);

  const onExitComplete = useCallback(() => {
    setPopupVisible(false);
    setPopupClosing(false);
    setHoveredDoorId(null);
    setActiveSubtitleText(null);
    doorHoveredRef.current = false;
    popupHoveredRef.current = false;
  }, []);

  const onEscapeKey = useCallback(() => {
    if (popupVisible && !popupClosing) {
      beginClose();
    }
  }, [popupVisible, popupClosing, beginClose]);

  return {
    hoveredDoorId,
    popupVisible,
    popupClosing,
    activeSubtitleText,
    onDoorPointerEnter,
    onDoorPointerLeave,
    onDoorFocus,
    onDoorBlur,
    onPopupPointerEnter,
    onPopupPointerLeave,
    onCloseClick,
    onExitComplete,
    onEscapeKey,
  };
}
