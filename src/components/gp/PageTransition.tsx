import { motion, useReducedMotion } from "motion/react";
import { useRouterState } from "@tanstack/react-router";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
