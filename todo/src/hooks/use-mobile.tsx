import * as React from "react";

export interface UseMobileOptions {
  breakpoint?: number;
  defaultValue?: boolean;
}

export function useMobile({
  breakpoint = 768,
  defaultValue = false,
}: UseMobileOptions = {}) {
  const [isMobile, setIsMobile] = React.useState<boolean>(defaultValue);

  React.useEffect(() => {
    // Create media query
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    // Update function
    const updateIsMobile = () => {
      setIsMobile(mql.matches);
    };

    // Initial check
    updateIsMobile();

    // Add listener
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", updateIsMobile);
      return () => mql.removeEventListener("change", updateIsMobile);
    } else {
      // Fallback for older browsers
      mql.addListener(updateIsMobile);
      return () => mql.removeListener(updateIsMobile);
    }
  }, [breakpoint]);

  return isMobile;
}
