import { useRef, useEffect } from 'react';

/**
 * useEffect to register window event listener
 * @param {*} eventName - string. Key of WindowEventMap
 * @param {*} handler - function
 * @param {*} runWhenInit - run event first time after init
 * @param {*} element - window or document
 */
const useEventListener = (
  eventName, handler, runWhenInit = false, element = window,
) => {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return null;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event);

      // initial run first time after render and
      // before add to window event listener
      if (runWhenInit) {
        eventListener();
      }

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element], // Re-run if eventName or element changes
  );
};

export default useEventListener;
