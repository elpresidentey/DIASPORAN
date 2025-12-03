"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-105",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:scale-105",
                outline: "text-foreground hover:bg-muted hover:scale-105 dark:hover:bg-white/5",
                success: "border-transparent bg-green-500/15 text-green-500 hover:bg-green-500/25 hover:scale-105 hover:shadow-glow-green dark:bg-green-500/15 dark:text-green-400 light:bg-green-100 light:text-green-700",
                warning: "border-transparent bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25 hover:scale-105 dark:bg-yellow-500/15 dark:text-yellow-400 light:bg-yellow-100 light:text-yellow-700",
                premium: "border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-glow-purple",
                shimmer: "border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white animate-gradient-x hover:scale-105",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    animated?: boolean
}

function Badge({ className, variant, animated = false, children, ...props }: BadgeProps) {
    if (animated) {
        return (
            <motion.div
                className={cn(badgeVariants({ variant }), className)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
            >
                <div {...props}>{children}</div>
            </motion.div>
        )
    }

    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props}>
            {children}
        </div>
    )
}

export { Badge, badgeVariants }
