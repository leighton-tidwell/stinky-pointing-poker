"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type RollingNumberProps = {
  value: number | string;
  className?: string;
  decimalPlaces?: number;
  colorPulseOnUpdate?: boolean;
};

export const RollingNumber = ({
  value,
  className = "",
  decimalPlaces = 2,
  colorPulseOnUpdate = true,
}: RollingNumberProps) => {
  const [displayValue, setDisplayValue] = useState(value.toString());
  const [shouldPulse, setShouldPulse] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const numValue =
      typeof value === "number" ? value.toFixed(decimalPlaces) : value;
    setDisplayValue(numValue);

    if (value !== prevValueRef.current && colorPulseOnUpdate) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 600);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
    prevValueRef.current = value;
  }, [value, decimalPlaces, colorPulseOnUpdate]);

  const digits = displayValue.split("");

  return (
    <motion.span
      className={`inline-flex overflow-hidden ${className}`}
      animate={{
        scale: shouldPulse ? 1.05 : 1,
        filter: shouldPulse
          ? "drop-shadow(0 0 15px rgba(34, 197, 94, 0.7))"
          : "drop-shadow(0 0 0px rgba(34, 197, 94, 0))",
      }}
      transition={{ duration: 0.3 }}
    >
      {digits.map((char, index) => {
        if (char === "." || char === ",") {
          return (
            <span key={`${char}-${index}`} className="inline-block">
              {char}
            </span>
          );
        }

        if (!/\d/.test(char)) {
          return (
            <span key={`${char}-${index}`} className="inline-block">
              {char}
            </span>
          );
        }

        return (
          <span
            key={`${char}-${index}`}
            className="relative inline-block overflow-hidden"
            style={{ minWidth: "1ch" }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`${char}-${value}`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="inline-block"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </motion.span>
  );
};
