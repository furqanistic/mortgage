// File: client/src/components/ui/alert.jsx
import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-2xl border px-6 py-4 text-sm [&>svg+div]:translate-y-[-1px] [&>svg]:absolute [&>svg]:left-6 [&>svg]:top-5 [&>svg]:text-foreground [&>svg~*]:pl-8 font-body transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-background border-border/60 text-foreground shadow-sm",
        destructive:
          "border-destructive/20 bg-destructive/5 text-destructive dark:border-destructive/30 [&>svg]:text-destructive font-semibold",
        success:
          "border-accent/20 bg-accent/5 text-primary dark:text-accent [&>svg]:text-accent font-semibold",
        outline:
          "bg-transparent border-primary/10 text-primary dark:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props} />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props} />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
