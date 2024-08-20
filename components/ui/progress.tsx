"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
const progressVariants = cva(
  "h-full w-full flex-1 bg-primary transition-all",

  {
    variants: {
      variant: {
        default: 'bg-sky-600',
        success: 'bg-emerald'
      }
    }
  }
)
export interface ProgreeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof progressVariants> {}
type CompinedProgressProps = ProgreeProps & React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>

const Progress = React.forwardRef<
React.ElementRef<typeof ProgressPrimitive.Root>,
CompinedProgressProps
>(({ className, value, variant, ...props }, ref) => (
<ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
