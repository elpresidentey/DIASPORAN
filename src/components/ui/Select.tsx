"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false)
        const [isHovered, setIsHovered] = React.useState(false)

        return (
            <motion.div
                className="relative"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                <select
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-foreground transition-all duration-300 dark:bg-white/5",
                        isFocused ? "border-primary/50" : isHovered ? "border-border/80 dark:border-white/20" : "border-border dark:border-white/10",
                        className
                    )}
                    ref={ref}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                >
                    {children}
                </select>
                <motion.div
                    animate={{
                        rotate: isFocused ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                        "absolute right-3 top-3 pointer-events-none transition-colors duration-200",
                        isFocused ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <ChevronDown className="h-4 w-4" />
                </motion.div>
            </motion.div>
        )
    }
)
Select.displayName = "Select"

export { Select }
