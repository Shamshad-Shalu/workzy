import type { BookingStatus } from "@/constants";

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; badge: string; accent: string; dot: string }
> = {
  pending: {
    label: "Pending",
    badge:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    accent: "border-l-amber-400",
    dot: "bg-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    badge:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    accent: "border-l-blue-500",
    dot: "bg-blue-500",
  },
  in_progress: {
    label: "In Progress",
    badge:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
    accent: "border-l-violet-500",
    dot: "bg-violet-500",
  },
  completed: {
    label: "Completed",
    badge:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    accent: "border-l-emerald-500",
    dot: "bg-emerald-500",
  },
  approved: {
    label: "Approved",
    badge:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    accent: "border-l-green-500",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-muted text-muted-foreground border-border",
    accent: "border-l-border",
    dot: "bg-muted-foreground",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    accent: "border-l-destructive",
    dot: "bg-destructive",
  },
  disputed: {
    label: "Disputed",
    badge:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    accent: "border-l-orange-500",
    dot: "bg-orange-400",
  },
};

export const PAYMENT_STATUS_META:Record<string, { label: string; cls: string }> = {
  pending: { label: "Payment Pending", cls: "text-amber-600 dark:text-amber-400" },
  held: { label: "Payment Held", cls: "text-blue-600 dark:text-blue-400" },
  released: { label: "Payment Released", cls: "text-green-600 dark:text-green-400" },
  refunded: { label: "Refunded", cls: "text-muted-foreground" },
  failed: { label: "Payment Failed", cls: "text-destructive" },
} as const;