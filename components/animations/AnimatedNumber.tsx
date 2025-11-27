"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({ 
  value, 
  className = "",
  duration = 1 
}: AnimatedNumberProps) {
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
  });

  const display = useTransform(spring, (current) =>
    Math.round(current)
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}

