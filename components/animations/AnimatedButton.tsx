"use client";

import { motion } from "framer-motion";
import { ReactNode, ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentProps<typeof Button>;

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  pulse?: boolean;
}

export function AnimatedButton({ 
  children, 
  className,
  pulse = false,
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
    >
      <Button className={cn(className)} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}

