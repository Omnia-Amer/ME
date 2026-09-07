import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind class strings (shadcn/21st.dev convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
