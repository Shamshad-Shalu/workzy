export default function WorkerDashboard() {
  return (
    <div className="space-y-4 ">
      <h1 className="text-2xl font-bold">Worker Dashboard</h1>
      <p className="text-muted-foreground">This is a dummy dashboard page to test the layout.</p>

      {/* Add some dummy boxes to test scrolling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
        <div className="h-40 rounded-xl bg-accent/40" />
      </div>
    </div>
  );
}

// import { useMemo, useState } from "react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Line,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";

// export type BookingStatus =
//   | "pending"
//   | "confirmed"
//   | "en_route"
//   | "reached"
//   | "in_progress"
//   | "completed"
//   | "approved"
//   | "cancelled"
//   | "rejected"
//   | "disputed";

// export type BookingPaymentStatus =
//   | "pending"
//   | "held"
//   | "released"
//   | "refunded"
//   | "cancelled"
//   | "failed";

// export type ExtraChargeStatus = "pending" | "approved" | "rejected";
// export type StripeAccountStatus = "not_connected" | "pending" | "active";
// export type WorkerVerificationStatus =
//   | "pending"
//   | "verified"
//   | "rejected"
//   | "needs_revision";
// export type DateRangePreset = "1w" | "1m" | "1y" | "custom";

// export interface DashboardWorker {
//   id: string;
//   name: string;
//   initials: string;
//   tagline: string;
//   categoryName: string;
//   profileImage?: string;
//   averageRating: number;
//   reviewCount: number;
//   worksCompleted: number;
//   completionRate: number;
//   isPremium: boolean;
//   status: WorkerVerificationStatus;
//   stripeAccountStatus: StripeAccountStatus;
//   payoutPending: number;
// }

// export interface DashboardBookingSlot {
//   date: string;
//   startTime: string;
//   endTime: string;
// }

// export interface DashboardExtraCharge {
//   amount: number;
//   reason: string;
//   status: ExtraChargeStatus;
//   requestedAt: string;
// }

// export interface DashboardBooking {
//   id: string;
//   bookingId: string;
//   customerName: string;
//   customerInitials: string;
//   customerImage?: string;
//   serviceName: string;
//   slots: DashboardBookingSlot[];
//   location: string;
//   total: number;
//   status: BookingStatus;
//   paymentStatus: BookingPaymentStatus;
//   extraCharge?: DashboardExtraCharge;
//   createdAt: string;
// }

// export interface DashboardEarningsPoint {
//   label: string;
//   earnings: number;
//   bookings: number;
//   weekStart: string;
// }

// export interface DashboardEarningsSummary {
//   gross: number;
//   platformFeePercent: number;
//   platformFeeAmount: number;
//   extraCharges: number;
//   travelReimbursement: number;
//   net: number;
//   bySource: { bookings: number; extraCharges: number; platformFee: number };
// }

// export interface DashboardNotification {
//   id: string;
//   type:
//     | "booking"
//     | "review"
//     | "payment"
//     | "cancellation"
//     | "extra_charge"
//     | "system";
//   message: string;
//   createdAt: string;
//   read: boolean;
// }

// export interface DashboardAvailability {
//   monday: boolean;
//   tuesday: boolean;
//   wednesday: boolean;
//   thursday: boolean;
//   friday: boolean;
//   saturday: boolean;
//   sunday: boolean;
// }

// export interface DashboardStats {
//   totalEarned: number;
//   completedJobs: number;
//   averageRating: number;
//   completionRate: number;
//   confirmedBookings: number;
//   cancelledBookings: number;
//   disputedBookings: number;
//   pendingActions: number;
//   earningsChange: number;
//   jobsChange: number;
// }

// export interface DateRange {
//   preset: DateRangePreset;
//   startDate: string;
//   endDate: string;
// }

// export interface WorkerDashboardData {
//   worker: DashboardWorker;
//   stats: DashboardStats;
//   recentBookings: DashboardBooking[];
//   todaySchedule: DashboardBooking[];
//   pendingActions: DashboardBooking[];
//   earningsHistory: DashboardEarningsPoint[];
//   earningsSummary: DashboardEarningsSummary;
//   notifications: DashboardNotification[];
//   availability: DashboardAvailability;
// }

// const DUMMY: WorkerDashboardData = {
//   worker: {
//     id: "w1",
//     name: "Rahul Nair",
//     initials: "RN",
//     tagline: "Plumbing & Pipe Works",
//     categoryName: "Plumbing",
//     averageRating: 4.9,
//     reviewCount: 112,
//     worksCompleted: 148,
//     completionRate: 97,
//     isPremium: true,
//     status: "verified",
//     stripeAccountStatus: "active",
//     payoutPending: 15500,
//   },
//   stats: {
//     totalEarned: 82400,
//     completedJobs: 148,
//     averageRating: 4.9,
//     completionRate: 97,
//     confirmedBookings: 12,
//     cancelledBookings: 4,
//     disputedBookings: 1,
//     pendingActions: 2,
//     earningsChange: 12,
//     jobsChange: 7,
//   },
//   recentBookings: [
//     {
//       id: "b1",
//       bookingId: "BK-2041",
//       customerName: "Arun Menon",
//       customerInitials: "AM",
//       serviceName: "Pipe leak fix",
//       slots: [{ date: "2024-04-16", startTime: "10:00", endTime: "11:30" }],
//       location: "Thrissur, Poothole",
//       total: 1200,
//       status: "completed",
//       paymentStatus: "released",
//       createdAt: "2024-04-16T08:00:00Z",
//     },
//     {
//       id: "b2",
//       bookingId: "BK-2042",
//       customerName: "Deepa Krishnan",
//       customerInitials: "DK",
//       serviceName: "Bathroom fitting",
//       slots: [{ date: "2024-04-16", startTime: "14:00", endTime: "17:00" }],
//       location: "Thrissur, Ayyanthole",
//       total: 2800,
//       status: "in_progress",
//       paymentStatus: "held",
//       extraCharge: {
//         amount: 400,
//         reason: "Extra pipe fittings",
//         status: "approved",
//         requestedAt: "2024-04-16T15:00:00Z",
//       },
//       createdAt: "2024-04-14T10:00:00Z",
//     },
//     {
//       id: "b3",
//       bookingId: "BK-2043",
//       customerName: "Sanjay Pillai",
//       customerInitials: "SP",
//       serviceName: "Motor installation",
//       slots: [{ date: "2024-04-17", startTime: "09:00", endTime: "12:00" }],
//       location: "Thrissur, Ollur",
//       total: 3500,
//       status: "confirmed",
//       paymentStatus: "held",
//       createdAt: "2024-04-15T09:00:00Z",
//     },
//     {
//       id: "b4",
//       bookingId: "BK-2044",
//       customerName: "Meera Varma",
//       customerInitials: "MV",
//       serviceName: "Water heater install",
//       slots: [{ date: "2024-04-18", startTime: "11:00", endTime: "13:00" }],
//       location: "Thrissur, Punkunnam",
//       total: 1900,
//       status: "pending",
//       paymentStatus: "held",
//       createdAt: "2024-04-16T06:00:00Z",
//     },
//     {
//       id: "b5",
//       bookingId: "BK-2039",
//       customerName: "Ravi Kumar",
//       customerInitials: "RK",
//       serviceName: "Tank cleaning",
//       slots: [{ date: "2024-04-15", startTime: "09:00", endTime: "11:00" }],
//       location: "Thrissur, Pottore",
//       total: 950,
//       status: "cancelled",
//       paymentStatus: "refunded",
//       createdAt: "2024-04-13T12:00:00Z",
//     },
//     {
//       id: "b6",
//       bookingId: "BK-2038",
//       customerName: "Priya Suresh",
//       customerInitials: "PS",
//       serviceName: "Tap replacement",
//       slots: [{ date: "2024-04-14", startTime: "10:00", endTime: "11:00" }],
//       location: "Thrissur, Wadakkanchery",
//       total: 750,
//       status: "approved",
//       paymentStatus: "released",
//       createdAt: "2024-04-12T09:00:00Z",
//     },
//   ],
//   todaySchedule: [
//     {
//       id: "b1",
//       bookingId: "BK-2041",
//       customerName: "Arun Menon",
//       customerInitials: "AM",
//       serviceName: "Pipe leak fix",
//       slots: [{ date: "2024-04-16", startTime: "10:00", endTime: "11:30" }],
//       location: "Thrissur, Poothole",
//       total: 1200,
//       status: "completed",
//       paymentStatus: "released",
//       createdAt: "2024-04-16T08:00:00Z",
//     },
//     {
//       id: "b2",
//       bookingId: "BK-2042",
//       customerName: "Deepa Krishnan",
//       customerInitials: "DK",
//       serviceName: "Bathroom fitting",
//       slots: [{ date: "2024-04-16", startTime: "14:00", endTime: "17:00" }],
//       location: "Thrissur, Ayyanthole",
//       total: 2800,
//       status: "in_progress",
//       paymentStatus: "held",
//       createdAt: "2024-04-14T10:00:00Z",
//     },
//   ],
//   pendingActions: [
//     {
//       id: "b4",
//       bookingId: "BK-2044",
//       customerName: "Meera Varma",
//       customerInitials: "MV",
//       serviceName: "Water heater install",
//       slots: [{ date: "2024-04-18", startTime: "11:00", endTime: "13:00" }],
//       location: "Thrissur, Punkunnam",
//       total: 1900,
//       status: "pending",
//       paymentStatus: "held",
//       createdAt: "2024-04-16T06:00:00Z",
//     },
//     {
//       id: "b7",
//       bookingId: "BK-2045",
//       customerName: "Akhil Thomas",
//       customerInitials: "AT",
//       serviceName: "Drain cleaning",
//       slots: [{ date: "2024-04-19", startTime: "09:00", endTime: "10:30" }],
//       location: "Thrissur, Thrissur Town",
//       total: 1100,
//       status: "pending",
//       paymentStatus: "held",
//       createdAt: "2024-04-16T07:00:00Z",
//     },
//   ],
//   earningsHistory: [
//     { label: "W1", earnings: 8200, bookings: 6, weekStart: "2024-02-26" },
//     { label: "W2", earnings: 7400, bookings: 5, weekStart: "2024-03-04" },
//     { label: "W3", earnings: 11000, bookings: 9, weekStart: "2024-03-11" },
//     { label: "W4", earnings: 9800, bookings: 7, weekStart: "2024-03-18" },
//     { label: "W5", earnings: 13200, bookings: 11, weekStart: "2024-03-25" },
//     { label: "W6", earnings: 10500, bookings: 8, weekStart: "2024-04-01" },
//     { label: "W7", earnings: 12400, bookings: 10, weekStart: "2024-04-08" },
//     { label: "W8", earnings: 14000, bookings: 12, weekStart: "2024-04-15" },
//   ],
//   earningsSummary: {
//     gross: 14000,
//     platformFeePercent: 10,
//     platformFeeAmount: 1400,
//     extraCharges: 2520,
//     travelReimbursement: 380,
//     net: 15500,
//     bySource: { bookings: 72, extraCharges: 18, platformFee: 10 },
//   },
//   notifications: [
//     {
//       id: "n1",
//       type: "booking",
//       message: "New booking request from Meera Varma for water heater install.",
//       createdAt: "2024-04-16T14:00:00Z",
//       read: false,
//     },
//     {
//       id: "n2",
//       type: "extra_charge",
//       message: "Extra charge of ₹400 was approved by Deepa Krishnan.",
//       createdAt: "2024-04-16T12:00:00Z",
//       read: false,
//     },
//     {
//       id: "n3",
//       type: "booking",
//       message: "Sanjay Pillai confirmed tomorrow's motor installation booking.",
//       createdAt: "2024-04-15T18:00:00Z",
//       read: true,
//     },
//     {
//       id: "n4",
//       type: "cancellation",
//       message: "Booking by Ravi Kumar was cancelled. Reason: schedule conflict.",
//       createdAt: "2024-04-14T10:00:00Z",
//       read: true,
//     },
//     {
//       id: "n5",
//       type: "review",
//       message: 'You received a 5-star review from Arun Menon. "Very professional!"',
//       createdAt: "2024-04-14T09:00:00Z",
//       read: true,
//     },
//   ],
//   availability: {
//     monday: true,
//     tuesday: true,
//     wednesday: false,
//     thursday: true,
//     friday: true,
//     saturday: true,
//     sunday: false,
//   },
// };

// // ─────────────────────────────────────────────────────────────
// // Helpers
// // ─────────────────────────────────────────────────────────────

// const fmtINR = (n: number) => "₹" + n.toLocaleString("en-IN");

// function timeAgo(iso: string) {
//   const diff = (Date.now() - new Date(iso).getTime()) / 1000;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   if (diff < 172800) return "Yesterday";
//   return `${Math.floor(diff / 86400)}d ago`;
// }

// function getRange(preset: Exclude<DateRangePreset, "custom">) {
//   const end = new Date();
//   const start = new Date();
//   if (preset === "1w") start.setDate(end.getDate() - 7);
//   else if (preset === "1m") start.setMonth(end.getMonth() - 1);
//   else start.setFullYear(end.getFullYear() - 1);
//   return {
//     startDate: start.toISOString().split("T")[0],
//     endDate: end.toISOString().split("T")[0],
//   };
// }

// // ─────────────────────────────────────────────────────────────
// // Status badge config  (maps to your CSS vars / tailwind tokens)
// // ─────────────────────────────────────────────────────────────

// const STATUS_CFG: Record<
//   BookingStatus,
//   { label: string; className: string }
// > = {
//   pending:     { label: "Pending",     className: "bg-muted text-muted-foreground border-border" },
//   confirmed:   { label: "Confirmed",   className: "bg-[var(--section-blue)] text-[var(--fine-blue)] border-[var(--section-blue-border)]" },
//   en_route:    { label: "En route",    className: "bg-[var(--section-blue)] text-[var(--fine-blue)] border-[var(--section-blue-border)]" },
//   reached:     { label: "Reached",     className: "bg-[var(--section-blue)] text-[var(--fine-blue)] border-[var(--section-blue-border)]" },
//   in_progress: { label: "In progress", className: "bg-[var(--section-blue)] text-[var(--fine-blue)] border-[var(--section-blue-border)]" },
//   completed:   { label: "Completed",   className: "bg-[var(--section-green)] text-[var(--section-green-border)] border-[var(--section-green-border)]" },
//   approved:    { label: "Approved",    className: "bg-[var(--section-green)] text-[var(--section-green-border)] border-[var(--section-green-border)]" },
//   cancelled:   { label: "Cancelled",   className: "bg-[var(--section-red)] text-destructive border-[var(--section-red-border)]" },
//   rejected:    { label: "Rejected",    className: "bg-[var(--section-red)] text-destructive border-[var(--section-red-border)]" },
//   disputed:    { label: "Disputed",    className: "bg-[var(--section-red)] text-destructive border-[var(--section-red-border)]" },
// };

// const NOTIF_DOT: Record<DashboardNotification["type"], string> = {
//   booking:      "bg-[var(--fine-blue)]",
//   review:       "bg-[var(--section-green-border)]",
//   payment:      "bg-[var(--section-green-border)]",
//   cancellation: "bg-destructive",
//   extra_charge: "bg-[var(--golden)]",
//   system:       "bg-muted-foreground",
// };

// // recharts doesn't support oklch natively → use hex-compatible values
// const PIE_HEX = ["#7C74D0", "#35A876", "#C4923A"];

// // ─────────────────────────────────────────────────────────────
// // Reusable sub-components
// // ─────────────────────────────────────────────────────────────

// /** Status badge using your section-color CSS variables */
// function StatusBadge({ status }: { status: BookingStatus }) {
//   const cfg = STATUS_CFG[status];
//   return (
//     <span
//       className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold ${cfg.className}`}
//     >
//       {cfg.label}
//     </span>
//   );
// }

// /** Section heading — uppercase, muted, wide tracking */
// function SectionTitle({ children }: { children: React.ReactNode }) {
//   return (
//     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
//       {children}
//     </p>
//   );
// }

// /** Top-level stat card */
// function MetricCard({
//   label,
//   value,
//   sub,
//   positive = true,
//   icon,
// }: {
//   label: string;
//   value: string;
//   sub: string;
//   positive?: boolean;
//   icon: React.ReactNode;
// }) {
//   return (
//     <Card>
//       <CardContent className="p-4">
//         <div className="flex items-center justify-between mb-2">
//           <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
//           <span className="text-lg leading-none">{icon}</span>
//         </div>
//         <p className="text-[22px] font-semibold tracking-tight text-foreground leading-none mb-1">
//           {value}
//         </p>
//         <p
//           className={`text-[11px] font-medium ${
//             positive
//               ? "text-[var(--section-green-border)]"
//               : "text-destructive"
//           }`}
//         >
//           {sub}
//         </p>
//       </CardContent>
//     </Card>
//   );
// }

// /** Single booking row — used in "recent bookings" list */
// function BookingRow({
//   booking,
//   showActions,
//   onAccept,
//   onDecline,
// }: {
//   booking: DashboardBooking;
//   showActions?: boolean;
//   onAccept?: (id: string) => void;
//   onDecline?: (id: string) => void;
// }) {
//   return (
//     <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0 last:pb-0 first:pt-0">
//       <Avatar className="h-8 w-8 flex-shrink-0">
//         {booking.customerImage && <AvatarImage src={booking.customerImage} />}
//         <AvatarFallback className="text-[11px] font-semibold bg-[var(--section-blue)] text-[var(--fine-blue)]">
//           {booking.customerInitials}
//         </AvatarFallback>
//       </Avatar>

//       <div className="flex-1 min-w-0">
//         <p className="text-[13px] font-medium text-foreground truncate">
//           {booking.customerName}
//         </p>
//         <p className="text-[11px] text-muted-foreground mt-0.5">
//           {booking.serviceName} · {booking.slots[0]?.startTime}
//         </p>
//       </div>

//       <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
//         <p className="text-[13px] font-semibold text-foreground">
//           {fmtINR(booking.total)}
//         </p>
//         {showActions ? (
//           <div className="flex gap-1">
//             <Button
//               size="sm"
//               variant="outline"
//               className="h-6 px-2 text-[11px] border-[var(--section-green-border)] text-[var(--section-green-border)] hover:bg-[var(--section-green)]"
//               onClick={() => onAccept?.(booking.id)}
//             >
//               Accept
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               className="h-6 px-2 text-[11px] border-[var(--section-red-border)] text-destructive hover:bg-[var(--section-red)]"
//               onClick={() => onDecline?.(booking.id)}
//             >
//               Decline
//             </Button>
//           </div>
//         ) : (
//           <StatusBadge status={booking.status} />
//         )}
//       </div>
//     </div>
//   );
// }

// /** Single schedule slot row */
// function ScheduleRow({
//   booking,
//   accentClass,
// }: {
//   booking: DashboardBooking;
//   accentClass: string;
// }) {
//   return (
//     <div className="flex gap-3 py-2.5 border-b border-border last:border-0 last:pb-0 first:pt-0">
//       <p className="text-[11px] font-medium text-muted-foreground w-12 pt-0.5 flex-shrink-0">
//         {booking.slots[0]?.startTime}
//       </p>
//       <div className={`w-0.5 rounded-full flex-shrink-0 my-0.5 ${accentClass}`} />
//       <div className="flex-1 min-w-0">
//         <p className="text-[13px] font-medium text-foreground truncate">
//           {booking.customerName} · {booking.serviceName}
//         </p>
//         <p className="text-[11px] text-muted-foreground mt-0.5">
//           {booking.location}
//         </p>
//         <div className="mt-1.5">
//           <StatusBadge status={booking.status} />
//         </div>
//       </div>
//     </div>
//   );
// }

// /** Horizontal progress bar for booking status overview */
// function StatusBar({
//   label,
//   count,
//   max,
//   barClass,
// }: {
//   label: string;
//   count: number;
//   max: number;
//   barClass: string;
// }) {
//   const pct = Math.max(2, Math.round((count / max) * 100));
//   return (
//     <div className="mb-3 last:mb-0">
//       <div className="flex justify-between text-[12px] mb-1.5">
//         <span className="text-muted-foreground">{label}</span>
//         <span className="font-semibold text-foreground">{count}</span>
//       </div>
//       <div className="h-1.5 rounded-full bg-muted overflow-hidden">
//         <div
//           className={`h-full rounded-full transition-all duration-500 ${barClass}`}
//           style={{ width: `${pct}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// /** Date range picker with preset tabs + optional custom date inputs */
// function DateRangePicker({
//   range,
//   onChange,
// }: {
//   range: DateRange;
//   onChange: (r: DateRange) => void;
// }) {
//   const presets: { key: DateRangePreset; label: string }[] = [
//     { key: "1w", label: "1W" },
//     { key: "1m", label: "1M" },
//     { key: "1y", label: "1Y" },
//     { key: "custom", label: "Custom" },
//   ];

//   const handle = (key: DateRangePreset) => {
//     if (key === "custom") {
//       onChange({ preset: "custom", ...getRange("1m") });
//     } else {
//       onChange({ preset: key, ...getRange(key) });
//     }
//   };

//   const shortFmt = (d: string) =>
//     new Date(d).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//     });

//   return (
//     <div className="flex items-center gap-2 flex-wrap">
//       {/* Pill group */}
//       <div className="flex gap-1 bg-muted p-1 rounded-lg">
//         {presets.map((p) => (
//           <button
//             key={p.key}
//             onClick={() => handle(p.key)}
//             className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all ${
//               range.preset === p.key
//                 ? "bg-card text-foreground shadow-sm"
//                 : "text-muted-foreground hover:text-foreground"
//             }`}
//           >
//             {p.label}
//           </button>
//         ))}
//       </div>

//       {/* Custom date inputs */}
//       {range.preset === "custom" && (
//         <div className="flex items-center gap-2">
//           <input
//             type="date"
//             value={range.startDate}
//             onChange={(e) => onChange({ ...range, startDate: e.target.value })}
//             className="text-[12px] px-2 py-1 rounded-md border border-input bg-background text-foreground outline-none focus:ring-1 focus:ring-ring"
//           />
//           <span className="text-muted-foreground text-xs">→</span>
//           <input
//             type="date"
//             value={range.endDate}
//             onChange={(e) => onChange({ ...range, endDate: e.target.value })}
//             className="text-[12px] px-2 py-1 rounded-md border border-input bg-background text-foreground outline-none focus:ring-1 focus:ring-ring"
//           />
//         </div>
//       )}

//       {/* Human label */}
//       <span className="text-[11px] text-muted-foreground hidden sm:block">
//         {shortFmt(range.startDate)} – {shortFmt(range.endDate)}
//       </span>
//     </div>
//   );
// }

// /** Recharts custom tooltip */
// function ChartTooltip({
//   active,
//   payload,
//   label,
// }: {
//   active?: boolean;
//   payload?: { name: string; value: number; color: string }[];
//   label?: string;
// }) {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-[12px]">
//       <p className="font-semibold text-foreground mb-1">{label}</p>
//       {payload.map((p) => (
//         <div
//           key={p.name}
//           className="flex items-center gap-2 text-muted-foreground"
//         >
//           <span
//             className="w-2 h-2 rounded-sm flex-shrink-0"
//             style={{ background: p.color }}
//           />
//           <span>{p.name === "earnings" ? "Earnings" : "Bookings"}:</span>
//           <span className="font-semibold text-foreground">
//             {p.name === "earnings"
//               ? fmtINR(p.value)
//               : p.value}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function WorkerDashboard() {
//   const data = DUMMY;

//   const [dateRange, setDateRange] = useState<DateRange>({
//     preset: "1m",
//     ...getRange("1m"),
//   });

//   // Local state for dismissing pending actions
//   const [dismissed, setDismissed] = useState<Set<string>>(new Set());
//   const pendingActions = data.pendingActions.filter(
//     (b) => !dismissed.has(b.id)
//   );

//   const handleAccept = (id: string) =>
//     setDismissed((prev) => new Set(prev).add(id));
//   const handleDecline = (id: string) =>
//     setDismissed((prev) => new Set(prev).add(id));

//   // Filter earnings by selected date range
//   const filteredEarnings = useMemo(() => {
//     const s = new Date(dateRange.startDate).getTime();
//     const e = new Date(dateRange.endDate).getTime();
//     return data.earningsHistory.filter((pt) => {
//       const t = new Date(pt.weekStart).getTime();
//       return t >= s && t <= e;
//     });
//   }, [dateRange, data.earningsHistory]);

//   const pieData = [
//     { name: "Bookings", value: data.earningsSummary.bySource.bookings },
//     { name: "Extra charges", value: data.earningsSummary.bySource.extraCharges },
//     { name: "Platform fee", value: data.earningsSummary.bySource.platformFee },
//   ];

//   const WEEK_DAYS: { key: keyof DashboardAvailability; label: string }[] = [
//     { key: "monday", label: "Mon" },
//     { key: "tuesday", label: "Tue" },
//     { key: "wednesday", label: "Wed" },
//     { key: "thursday", label: "Thu" },
//     { key: "friday", label: "Fri" },
//     { key: "saturday", label: "Sat" },
//     { key: "sunday", label: "Sun" },
//   ];
//   const TODAY_IDX = 0; // Monday = today in dummy data

//   const unread = data.notifications.filter((n) => !n.read).length;

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">

//         {/* ── Top bar ── */}
//         <div className="flex items-center justify-between flex-wrap gap-3">
//           <div className="flex items-center gap-3">
//             <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-[var(--section-blue-border)]">
//               {data.worker.profileImage && (
//                 <AvatarImage src={data.worker.profileImage} />
//               )}
//               <AvatarFallback className="bg-[var(--section-blue)] text-[var(--fine-blue)] font-bold text-sm">
//                 {data.worker.initials}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h1 className="text-[17px] font-semibold tracking-tight text-foreground">
//                   {data.worker.name}
//                 </h1>
//                 {data.worker.isPremium && (
//                   <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--section-green)] text-[var(--section-green-border)] border border-[var(--section-green-border)]">
//                     PREMIUM
//                   </span>
//                 )}
//               </div>
//               <p className="text-[13px] text-muted-foreground mt-0.5">
//                 {data.worker.tagline}&nbsp;·&nbsp;
//                 <span className="text-[var(--golden)]">{"★".repeat(5)}</span>
//                 &nbsp;{data.worker.averageRating} ({data.worker.reviewCount}{" "}
//                 reviews)
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 flex-wrap">
//             <Badge
//               variant="outline"
//               className="text-[10px] bg-[var(--section-green)] text-[var(--section-green-border)] border-[var(--section-green-border)]"
//             >
//               ✓ Verified
//             </Badge>
//             <Badge
//               variant="outline"
//               className="text-[10px] bg-[var(--section-blue)] text-[var(--fine-blue)] border-[var(--section-blue-border)]"
//             >
//               Stripe connected
//             </Badge>
//             {unread > 0 && (
//               <Badge className="text-[10px] bg-destructive text-white">
//                 {unread} unread
//               </Badge>
//             )}
//             {pendingActions.length > 0 && (
//               <Badge
//                 variant="outline"
//                 className="text-[10px] bg-[var(--section-red)] text-destructive border-[var(--section-red-border)]"
//               >
//                 {pendingActions.length} action
//                 {pendingActions.length > 1 ? "s" : ""} needed
//               </Badge>
//             )}
//           </div>
//         </div>

//         {/* ── Payout banner ── */}
//         <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[var(--section-blue)] border border-[var(--section-blue-border)]">
//           <div className="flex items-center gap-3">
//             <span className="text-xl">💰</span>
//             <div>
//               <p className="text-[13px] font-semibold text-foreground">
//                 {fmtINR(data.worker.payoutPending)} pending payout
//               </p>
//               <p className="text-[11px] text-muted-foreground">
//                 Released after booking approval
//               </p>
//             </div>
//           </div>
//           <Button
//             size="sm"
//             variant="outline"
//             className="text-[12px] flex-shrink-0 border-[var(--section-blue-border)] text-[var(--fine-blue)] hover:bg-card"
//           >
//             View details
//           </Button>
//         </div>

//         {/* ── Date range picker bar ── */}
//         <Card>
//           <CardContent className="py-3 px-4 flex items-center gap-3 flex-wrap">
//             <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest shrink-0">
//               Period
//             </span>
//             <Separator orientation="vertical" className="h-4 hidden sm:block" />
//             <DateRangePicker range={dateRange} onChange={setDateRange} />
//           </CardContent>
//         </Card>

//         {/* ── Metric cards ── */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           <MetricCard
//             label="Total earned"
//             value={fmtINR(data.stats.totalEarned)}
//             sub={`+${data.stats.earningsChange}% this period`}
//             icon="₹"
//           />
//           <MetricCard
//             label="Completed jobs"
//             value={String(data.stats.completedJobs)}
//             sub={`+${data.stats.jobsChange} this week`}
//             icon="✅"
//           />
//           <MetricCard
//             label="Avg rating"
//             value={`${data.stats.averageRating} ★`}
//             sub={`${data.worker.reviewCount} reviews`}
//             icon="⭐"
//           />
//           <MetricCard
//             label="Completion rate"
//             value={`${data.stats.completionRate}%`}
//             sub="Top 5% of workers"
//             icon="🏆"
//           />
//         </div>

//         {/* ── Earnings chart ── */}
//         <Card>
//           <CardHeader className="pb-0 pt-5 px-5">
//             <div className="flex items-center justify-between flex-wrap gap-3">
//               <SectionTitle>Earnings over time</SectionTitle>
//               <div className="flex gap-4 mb-3">
//                 {[
//                   { hex: "#7C74D0", label: "Earnings" },
//                   { hex: "#35A876", label: "Bookings" },
//                 ].map((l) => (
//                   <div
//                     key={l.label}
//                     className="flex items-center gap-1.5 text-[12px] text-muted-foreground"
//                   >
//                     <span
//                       className="w-2.5 h-2.5 rounded-sm"
//                       style={{ background: l.hex }}
//                     />
//                     {l.label}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="pb-5 px-2">
//             {filteredEarnings.length > 0 ? (
//               <ResponsiveContainer width="100%" height={200}>
//                 <BarChart
//                   data={filteredEarnings}
//                   barSize={20}
//                   margin={{ top: 4, right: 8, left: -8, bottom: 0 }}
//                 >
//                   <CartesianGrid
//                     vertical={false}
//                     stroke="currentColor"
//                     className="text-border opacity-50"
//                     strokeDasharray="3 3"
//                   />
//                   <XAxis
//                     dataKey="label"
//                     tick={{ fontSize: 11 }}
//                     className="text-muted-foreground"
//                     axisLine={false}
//                     tickLine={false}
//                   />
//                   <YAxis
//                     yAxisId="left"
//                     tick={{ fontSize: 11 }}
//                     className="text-muted-foreground"
//                     axisLine={false}
//                     tickLine={false}
//                     tickFormatter={(v) => `₹${v / 1000}k`}
//                   />
//                   <YAxis yAxisId="right" hide orientation="right" />
//                   <Tooltip content={<ChartTooltip />} />
//                   <Bar
//                     yAxisId="left"
//                     dataKey="earnings"
//                     fill="#7C74D0"
//                     radius={[4, 4, 0, 0]}
//                   />
//                   <Line
//                     yAxisId="right"
//                     type="monotone"
//                     dataKey="bookings"
//                     stroke="#35A876"
//                     strokeWidth={2}
//                     dot={{ r: 3, fill: "#35A876" }}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-[200px] flex items-center justify-center text-muted-foreground text-[13px]">
//                 No data for the selected date range — try expanding the period.
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* ── Pending actions ── */}
//         {pendingActions.length > 0 && (
//           <Card className="border-[var(--section-red-border)] bg-[var(--section-red)]">
//             <CardHeader className="pb-2 pt-4 px-5">
//               <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">
//                 ⚡ Action required — {pendingActions.length} booking
//                 {pendingActions.length > 1 ? "s" : ""} pending your response
//               </p>
//             </CardHeader>
//             <CardContent className="px-5 pb-4">
//               {pendingActions.map((b) => (
//                 <BookingRow
//                   key={b.id}
//                   booking={b}
//                   showActions
//                   onAccept={handleAccept}
//                   onDecline={handleDecline}
//                 />
//               ))}
//             </CardContent>
//           </Card>
//         )}

//         {/* ── Mid row: Recent Bookings + Schedule ── */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           {/* Recent bookings */}
//           <Card>
//             <CardHeader className="pb-2 pt-5 px-5">
//               <SectionTitle>Recent bookings</SectionTitle>
//             </CardHeader>
//             <CardContent className="px-5 pb-5">
//               {data.recentBookings.map((b) => (
//                 <BookingRow key={b.id} booking={b} />
//               ))}
//             </CardContent>
//           </Card>

//           {/* Today's schedule + weekly availability */}
//           <Card>
//             <CardHeader className="pb-2 pt-5 px-5">
//               <SectionTitle>Today's schedule</SectionTitle>
//             </CardHeader>
//             <CardContent className="px-5 pb-5">
//               {data.todaySchedule.map((b, i) => (
//                 <ScheduleRow
//                   key={b.id}
//                   booking={b}
//                   accentClass={
//                     i === 0
//                       ? "bg-[var(--fine-blue)]"
//                       : "bg-[var(--section-green-border)]"
//                   }
//                 />
//               ))}
//               {/* Free slot */}
//               <div className="flex gap-3 py-2.5">
//                 <p className="text-[11px] font-medium text-muted-foreground w-12 pt-0.5 flex-shrink-0">
//                   5:00 PM
//                 </p>
//                 <div className="w-0.5 rounded-full bg-muted flex-shrink-0 my-0.5" />
//                 <p className="text-[13px] text-muted-foreground">
//                   Free slot — available for bookings
//                 </p>
//               </div>

//               <Separator className="my-4" />

//               {/* Weekly availability */}
//               <SectionTitle>Weekly availability</SectionTitle>
//               <div className="grid grid-cols-7 gap-1 text-center">
//                 {WEEK_DAYS.map((d, i) => {
//                   const on = data.availability[d.key];
//                   const isToday = i === TODAY_IDX;
//                   return (
//                     <div
//                       key={d.key}
//                       className="flex flex-col items-center gap-1.5"
//                     >
//                       <span className="text-[10px] text-muted-foreground">
//                         {d.label}
//                       </span>
//                       <div
//                         className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
//                           isToday
//                             ? "bg-primary text-primary-foreground"
//                             : on
//                             ? "bg-[var(--section-green)] text-[var(--section-green-border)]"
//                             : "bg-muted text-muted-foreground"
//                         }`}
//                       >
//                         {isToday ? "●" : on ? "✓" : "–"}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* ── Bottom row: Earnings breakdown + Notifications ── */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           {/* Earnings breakdown */}
//           <Card>
//             <CardHeader className="pb-2 pt-5 px-5">
//               <SectionTitle>Earnings breakdown</SectionTitle>
//             </CardHeader>
//             <CardContent className="px-5 pb-5">
//               {/* Donut + legend */}
//               <div className="flex items-center gap-6 mb-5">
//                 <PieChart width={90} height={90}>
//                   <Pie
//                     data={pieData}
//                     cx={40}
//                     cy={40}
//                     innerRadius={27}
//                     outerRadius={43}
//                     dataKey="value"
//                     strokeWidth={0}
//                   >
//                     {pieData.map((_, i) => (
//                       <Cell key={i} fill={PIE_HEX[i]} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//                 <div className="space-y-2">
//                   {pieData.map((p, i) => (
//                     <div
//                       key={p.name}
//                       className="flex items-center gap-2 text-[12px] text-muted-foreground"
//                     >
//                       <span
//                         className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
//                         style={{ background: PIE_HEX[i] }}
//                       />
//                       {p.name}&nbsp;
//                       <span className="font-semibold text-foreground">
//                         {p.value}%
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Line items */}
//               {[
//                 {
//                   label: "Gross earnings",
//                   value: fmtINR(data.earningsSummary.gross),
//                   cls: "",
//                 },
//                 {
//                   label: `Platform fee (${data.earningsSummary.platformFeePercent}%)`,
//                   value: `−${fmtINR(data.earningsSummary.platformFeeAmount)}`,
//                   cls: "text-destructive",
//                 },
//                 {
//                   label: "Extra charges",
//                   value: `+${fmtINR(data.earningsSummary.extraCharges)}`,
//                   cls: "text-[var(--section-green-border)]",
//                 },
//                 {
//                   label: "Travel reimbursement",
//                   value: `+${fmtINR(data.earningsSummary.travelReimbursement)}`,
//                   cls: "text-[var(--section-green-border)]",
//                 },
//               ].map((row) => (
//                 <div
//                   key={row.label}
//                   className="flex justify-between items-center py-2.5 border-b border-border last:border-0 text-[13px]"
//                 >
//                   <span className="text-muted-foreground">{row.label}</span>
//                   <span className={`font-semibold ${row.cls || "text-foreground"}`}>
//                     {row.value}
//                   </span>
//                 </div>
//               ))}

//               <div className="flex justify-between items-center pt-3 mt-1">
//                 <span className="text-[14px] font-semibold text-foreground">
//                   Net payout
//                 </span>
//                 <span className="text-[20px] font-bold text-[var(--fine-blue)]">
//                   {fmtINR(data.earningsSummary.net)}
//                 </span>
//               </div>

//               <Separator className="my-4" />

//               <SectionTitle>Booking status overview</SectionTitle>
//               <StatusBar
//                 label="Completed"
//                 count={data.stats.completedJobs}
//                 max={160}
//                 barClass="bg-primary"
//               />
//               <StatusBar
//                 label="Confirmed"
//                 count={data.stats.confirmedBookings}
//                 max={160}
//                 barClass="bg-[var(--section-green-border)]"
//               />
//               <StatusBar
//                 label="Cancelled"
//                 count={data.stats.cancelledBookings}
//                 max={160}
//                 barClass="bg-destructive"
//               />
//               <StatusBar
//                 label="Disputed"
//                 count={data.stats.disputedBookings}
//                 max={160}
//                 barClass="bg-[var(--golden)]"
//               />
//             </CardContent>
//           </Card>

//           {/* Notifications */}
//           <Card>
//             <CardHeader className="pb-2 pt-5 px-5">
//               <div className="flex items-center justify-between">
//                 <SectionTitle>Notifications</SectionTitle>
//                 {unread > 0 && (
//                   <Badge className="text-[10px] bg-destructive text-white mb-3">
//                     {unread} unread
//                   </Badge>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent className="px-5 pb-5">
//               {data.notifications.map((n) => (
//                 <div
//                   key={n.id}
//                   className="flex gap-3 py-2.5 border-b border-border last:border-0 last:pb-0 first:pt-0"
//                 >
//                   <span
//                     className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${NOTIF_DOT[n.type]} ${
//                       n.read ? "opacity-30" : ""
//                     }`}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <p
//                       className={`text-[12px] leading-relaxed ${
//                         n.read ? "text-muted-foreground" : "text-foreground"
//                       }`}
//                     >
//                       {n.message}
//                     </p>
//                     <p className="text-[11px] text-muted-foreground mt-1">
//                       {timeAgo(n.createdAt)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
