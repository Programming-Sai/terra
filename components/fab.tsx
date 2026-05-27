"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./icon";
import AvailabilitySearch from "./availability-search";

export const FAB = () => {
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startMobileLongPress = () => {
    longPressTriggeredRef.current = false;
    clearLongPressTimer();

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTriggeredRef.current = true;
      setIsMobileActionsOpen(true);
      setIsAvailabilityOpen(false);
    }, 500);
  };

  const handleMobileButtonClick = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    setIsAvailabilityOpen(true);
    setIsMobileActionsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-3 group print:hidden">
        <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
          <a
            className="bg-white text-charred-wood border border-surface-container flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:bg-surface-container transition-colors"
            href="https://wa.me/233241234567"
            rel="noreferrer"
            target="_blank"
          >
            <span className="text-sm font-bold font-label-caps uppercase">
              WhatsApp
            </span>
            <Icon name="chat" className="text-green-600" />
          </a>
          <button
            className="bg-white text-charred-wood border border-surface-container flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:bg-surface-container transition-colors"
            onClick={() => setIsAvailabilityOpen(true)}
            type="button"
          >
            <span className="text-sm font-bold font-label-caps uppercase">
              Check Availability
            </span>
            <Icon name="event_available" className="text-primary" />
          </button>
          <button
            className="bg-white text-charred-wood border border-surface-container flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:bg-surface-container transition-colors"
            onClick={scrollToTop}
            type="button"
          >
            <span className="text-sm font-bold font-label-caps uppercase">
              Back to Top
            </span>
            <Icon name="arrow_upward" className="text-primary" />
          </button>
        </div>
        <button
          aria-label="Open booking actions"
          className="hidden md:flex bg-laterite-red text-white w-14 h-14 rounded-full shadow-2xl items-center justify-center hover:scale-110 transition-transform"
          onClick={() => setIsAvailabilityOpen(true)}
          type="button"
        >
          <Icon name="calendar_month" className="text-2xl" />
        </button>
      </div>

      <div className="fixed bottom-24 right-4 z-[100] flex flex-col items-end gap-3 md:hidden print:hidden">
        {isMobileActionsOpen ? (
          <>
            <button
              aria-label="Close quick actions"
              className="fixed inset-0 z-[99] bg-black/0"
              onClick={() => setIsMobileActionsOpen(false)}
              type="button"
            />
            <div className="relative z-[101] flex flex-col items-end gap-2">
              <a
                className="bg-white text-charred-wood border border-surface-container flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:bg-surface-container transition-colors"
                href="https://wa.me/233241234567"
                rel="noreferrer"
                target="_blank"
                onClick={() => setIsMobileActionsOpen(false)}
              >
                <span className="text-sm font-bold font-label-caps uppercase">
                  WhatsApp
                </span>
                <Icon name="chat" className="text-green-600 text-[26px]" />
              </a>
              <button
                className="bg-white text-charred-wood border border-surface-container flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:bg-surface-container transition-colors"
                onClick={() => {
                  setIsAvailabilityOpen(true);
                  setIsMobileActionsOpen(false);
                }}
                type="button"
              >
                <span className="text-sm font-bold font-label-caps uppercase">
                  Check Availability
                </span>
                <Icon name="event_available" className="text-primary text-[26px]" />
              </button>
              <button
                className="bg-white text-charred-wood border border-surface-container flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:bg-surface-container transition-colors"
                onClick={() => {
                  scrollToTop();
                  setIsMobileActionsOpen(false);
                }}
                type="button"
              >
                <span className="text-sm font-bold font-label-caps uppercase">
                  Back to Top
                </span>
                <Icon name="arrow_upward" className="text-primary text-[26px]" />
              </button>
            </div>
          </>
        ) : null}
        <button
          aria-label="Hold to open quick actions"
          className="bg-laterite-red text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center touch-none"
          onClick={handleMobileButtonClick}
          onTouchCancel={clearLongPressTimer}
          onTouchEnd={clearLongPressTimer}
          onTouchMove={clearLongPressTimer}
          onTouchStart={startMobileLongPress}
          type="button"
        >
          <Icon name="calendar_month" className="text-[28px]" />
        </button>
      </div>

      {isAvailabilityOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
          <button
            aria-label="Close availability modal"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsAvailabilityOpen(false)}
            type="button"
          />
          <div className="relative w-full max-w-[560px] bg-white border border-surface-container shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
            <button
              aria-label="Close availability modal"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-outline-clay hover:text-primary transition-colors"
              onClick={() => setIsAvailabilityOpen(false)}
              type="button"
            >
              <Icon name="close" className="text-[24px]" />
            </button>
            <div className="p-8 pt-12">
              <span className="font-label-caps text-xs font-bold text-laterite-red uppercase tracking-widest">
                Check Availability
              </span>
              <h2 className="font-headline-sm text-3xl font-bold text-charred-wood mt-3">
                Plan Your Stay
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mt-3 mb-6 leading-relaxed">
                Pick your dates, guest count, and room type, then we&apos;ll take you straight
                to the available rooms.
              </p>
              <AvailabilitySearch
                compact
                onNavigate={() => setIsAvailabilityOpen(false)}
                submitLabel="Find Rooms"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
