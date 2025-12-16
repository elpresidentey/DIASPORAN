"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gradient-to-r from-primary via-accent to-primary"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 1, transformOrigin: "right", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
