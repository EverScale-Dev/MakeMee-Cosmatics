// components/ui/tracking-timeline.tsx

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Circle, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

const StatusIcon = ({ status, customIcon }) => {
  if (customIcon) return <>{customIcon}</>;

  switch (status) {
    case "completed":
      return <Check className="h-4 w-4 text-white" />;
    case "in-progress":
      return <CircleDot className="h-4 w-4 text-blue-600" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
};

const TrackingTimeline = ({ items, className }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.ol
      className={cn(
        "relative ml-6 border-l-2 border-gray-300",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {items.map((item) => (
        <motion.li
          key={item.id}
          className="relative mb-10 ml-8"
          variants={itemVariants}
          aria-current={item.status === "in-progress" ? "step" : undefined}
        >
          {/* Icon circle */}
          <span
            className={cn(
              "absolute -left-[50px] flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-white",
              {
                "bg-[#731162]": item.status === "completed",
                "bg-[#F0A400]": item.status === "in-progress",
                "bg-gray-200": item.status === "pending",
              }
            )}
          >
            {item.status === "in-progress" && (
              <span className="absolute h-full w-full animate-ping rounded-full bg-blue-400 opacity-30" />
            )}
            <StatusIcon status={item.status} customIcon={item.icon} />
          </span>

          {/* Content */}
          <div className="flex flex-col">
            <h3
              className={cn("font-semibold", {
                "text-gray-900": item.status !== "pending",
                "text-gray-500": item.status === "pending",
              })}
            >
              {item.title}
            </h3>
            <time
              className={cn("text-sm text-gray-500", {
                "font-medium text-gray-700":
                  item.status === "in-progress",
              })}
            >
              {item.date}
            </time>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
};

export default TrackingTimeline;
