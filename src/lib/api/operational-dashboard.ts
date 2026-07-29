import type { KpiMetric } from "./types";

export interface OperationalKpiMetric extends KpiMetric {
  previousValue: number;
}

export interface DailyAppointmentTrendPoint {
  date: string;
  day: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface AppointmentStatusDistributionPoint {
  status: "Completed" | "Cancelled" | "No Show" | "In Progress";
  count: number;
  percentage: number;
  color: string;
}

export interface ProviderUtilizationPoint {
  providerName: string;
  utilizationPct: number;
  bookedSlots: number;
  totalSlots: number;
  specialty: string;
}

export interface WaitTimeByLocationPoint {
  location: string;
  avgWaitMinutes: number;
  targetWaitMinutes: number;
}

export interface PatientFlowTimelinePoint {
  hour: string;
  checkIns: number;
  examInRoom: number;
  checkOuts: number;
}

export interface OperationalSummaryRow {
  id: string;
  practice: string;
  location: string;
  provider: string;
  department: string;
  scheduledAppointments: number;
  completedVisits: number;
  noShows: number;
  cancellations: number;
  avgWaitMinutes: number;
  avgVisitDurationMinutes: number;
  utilizationPct: number;
}

export interface AppointmentDetailRow {
  id: string;
  appointmentNumber: string;
  patientName: string;
  timeSlot: string;
  provider: string;
  status: "Completed" | "Checked In" | "No Show" | "Cancelled";
  checkInTime: string;
  waitMinutes: number;
}

export interface ProviderScheduleSlot {
  time: string;
  patientName: string;
  visitType: string;
  status: "Completed" | "In Progress" | "Booked" | "Open";
  durationMinutes: number;
}

export interface DepartmentPerformanceDetail {
  department: string;
  staffCount: number;
  avgWaitMinutes: number;
  completionRate: number;
  utilizationPct: number;
}

export interface OperationalAiInsight {
  id: string;
  headline: string;
  body: string;
  recommendation: string;
  category: "Peak Hours" | "Excessive Wait Times" | "Low Provider Utilization" | "No-Show Pattern" | "Operational Efficiency";
  estimatedImpact: number;
  confidence: number;
  locationName?: string;
  type: "positive" | "warning" | "critical" | "info";
}

export interface OperationalDashboardData {
  kpis: {
    totalAppointments: OperationalKpiMetric;
    patientCheckIns: OperationalKpiMetric;
    avgWaitTime: OperationalKpiMetric;
    avgVisitDuration: OperationalKpiMetric;
    providerUtilization: OperationalKpiMetric;
    appointmentCompletionRate: OperationalKpiMetric;
    noShowRate: OperationalKpiMetric;
    cancellationRate: OperationalKpiMetric;
  };
  dailyTrend: DailyAppointmentTrendPoint[];
  statusDistribution: AppointmentStatusDistributionPoint[];
  providerUtilization: ProviderUtilizationPoint[];
  waitTimeByLocation: WaitTimeByLocationPoint[];
  patientFlowTimeline: PatientFlowTimelinePoint[];
  summaryRows: OperationalSummaryRow[];
  aiInsights: OperationalAiInsight[];
  lastUpdated: string;
}

export function getMockOperationalDashboardData(): OperationalDashboardData {
  return {
    kpis: {
      totalAppointments: {
        id: "total-appointments",
        label: "Total Appointments",
        value: 9840,
        previousValue: 9210,
        format: "number",
        deltaPct: 6.8,
        trend: "up",
        helper: "+630 scheduled visits",
      },
      patientCheckIns: {
        id: "patient-check-ins",
        label: "Patient Check-ins",
        value: 9120,
        previousValue: 8480,
        format: "number",
        deltaPct: 7.5,
        trend: "up",
        helper: "92.7% check-in rate",
      },
      avgWaitTime: {
        id: "avg-wait-time",
        label: "Average Wait Time",
        value: 14.2,
        previousValue: 18.5,
        format: "number",
        deltaPct: -23.2,
        trend: "down",
        target: 15.0,
        helper: "4.3 min wait reduction",
      },
      avgVisitDuration: {
        id: "avg-visit-duration",
        label: "Average Visit Duration",
        value: 28.5,
        previousValue: 31.0,
        format: "number",
        deltaPct: -8.1,
        trend: "down",
        target: 30.0,
        helper: "28.5 min mean exam time",
      },
      providerUtilization: {
        id: "provider-utilization",
        label: "Provider Utilization",
        value: 88.4,
        previousValue: 84.2,
        format: "percent",
        deltaPct: 4.2,
        trend: "up",
        target: 85.0,
        helper: "+4.2% schedule capacity used",
      },
      appointmentCompletionRate: {
        id: "appointment-completion-rate",
        label: "Appointment Completion Rate",
        value: 92.7,
        previousValue: 89.1,
        format: "percent",
        deltaPct: 3.6,
        trend: "up",
        target: 90.0,
        helper: "9,120 of 9,840 completed",
      },
      noShowRate: {
        id: "no-show-rate",
        label: "No-Show Rate",
        value: 4.1,
        previousValue: 5.6,
        format: "percent",
        deltaPct: -1.5,
        trend: "down",
        target: 4.0,
        helper: "1.5% reduction in no-shows",
      },
      cancellationRate: {
        id: "cancellation-rate",
        label: "Cancellation Rate",
        value: 3.2,
        previousValue: 5.3,
        format: "percent",
        deltaPct: -2.1,
        trend: "down",
        target: 4.0,
        helper: "315 total cancellations",
      },
    },
    dailyTrend: [
      { date: "Mon", day: "Monday", scheduled: 1650, completed: 1540, cancelled: 60, noShow: 50 },
      { date: "Tue", day: "Tuesday", scheduled: 1720, completed: 1610, cancelled: 55, noShow: 55 },
      { date: "Wed", day: "Wednesday", scheduled: 1810, completed: 1700, cancelled: 62, noShow: 48 },
      { date: "Thu", day: "Thursday", scheduled: 1780, completed: 1650, cancelled: 70, noShow: 60 },
      { date: "Fri", day: "Friday", scheduled: 1540, completed: 1400, cancelled: 80, noShow: 60 },
      { date: "Sat", day: "Saturday", scheduled: 840, completed: 780, cancelled: 35, noShow: 25 },
      { date: "Sun", day: "Sunday", scheduled: 500, completed: 440, cancelled: 38, noShow: 22 },
    ],
    statusDistribution: [
      { status: "Completed", count: 9120, percentage: 92.7, color: "var(--chart-1)" },
      { status: "No Show", count: 405, percentage: 4.1, color: "var(--chart-2)" },
      { status: "Cancelled", count: 315, percentage: 3.2, color: "var(--chart-3)" },
    ],
    providerUtilization: [
      { providerName: "Dr. Eleanor Vance", utilizationPct: 94.5, bookedSlots: 378, totalSlots: 400, specialty: "Cardiology" },
      { providerName: "Dr. Marcus Thorne", utilizationPct: 91.2, bookedSlots: 365, totalSlots: 400, specialty: "Orthopedic Surgery" },
      { providerName: "Dr. Sophia Patel", utilizationPct: 88.0, bookedSlots: 352, totalSlots: 400, specialty: "Neurology" },
      { providerName: "Dr. Liam O'Connor", utilizationPct: 86.4, bookedSlots: 345, totalSlots: 400, specialty: "Gastroenterology" },
      { providerName: "Dr. Rachel Green", utilizationPct: 81.5, bookedSlots: 326, totalSlots: 400, specialty: "Family Medicine" },
      { providerName: "Dr. Christopher Blake", utilizationPct: 76.0, bookedSlots: 304, totalSlots: 400, specialty: "Cardiology" },
    ],
    waitTimeByLocation: [
      { location: "Main Campus Clinic", avgWaitMinutes: 11.4, targetWaitMinutes: 15.0 },
      { location: "Ambulatory Care Suite", avgWaitMinutes: 13.8, targetWaitMinutes: 15.0 },
      { location: "North Annex Orthopedics", avgWaitMinutes: 19.2, targetWaitMinutes: 15.0 },
      { location: "Satellite Care Center", avgWaitMinutes: 10.5, targetWaitMinutes: 15.0 },
      { location: "Telehealth Virtual Suite", avgWaitMinutes: 3.2, targetWaitMinutes: 5.0 },
    ],
    patientFlowTimeline: [
      { hour: "08:00 AM", checkIns: 45, examInRoom: 35, checkOuts: 15 },
      { hour: "09:00 AM", checkIns: 92, examInRoom: 80, checkOuts: 65 },
      { hour: "10:00 AM", checkIns: 115, examInRoom: 105, checkOuts: 98 },
      { hour: "11:00 AM", checkIns: 120, examInRoom: 112, checkOuts: 110 },
      { hour: "12:00 PM", checkIns: 60, examInRoom: 70, checkOuts: 85 },
      { hour: "01:00 PM", checkIns: 95, examInRoom: 88, checkOuts: 72 },
      { hour: "02:00 PM", checkIns: 110, examInRoom: 102, checkOuts: 95 },
      { hour: "03:00 PM", checkIns: 105, examInRoom: 98, checkOuts: 100 },
      { hour: "04:00 PM", checkIns: 70, examInRoom: 75, checkOuts: 85 },
      { hour: "05:00 PM", checkIns: 30, examInRoom: 35, checkOuts: 55 },
    ],
    summaryRows: [
      {
        id: "ops-1",
        practice: "Main Campus Medical Center",
        location: "Main Campus Clinic",
        provider: "Dr. Eleanor Vance",
        department: "Outpatient Clinic",
        scheduledAppointments: 1540,
        completedVisits: 1455,
        noShows: 48,
        cancellations: 37,
        avgWaitMinutes: 11.4,
        avgVisitDurationMinutes: 26.2,
        utilizationPct: 94.5,
      },
      {
        id: "ops-2",
        practice: "North Orthopedic Associates",
        location: "North Annex Orthopedics",
        provider: "Dr. Marcus Thorne",
        department: "Surgical Suite",
        scheduledAppointments: 1380,
        completedVisits: 1270,
        noShows: 62,
        cancellations: 48,
        avgWaitMinutes: 19.2,
        avgVisitDurationMinutes: 34.5,
        utilizationPct: 91.2,
      },
      {
        id: "ops-3",
        practice: "Ambulatory Health Group",
        location: "Ambulatory Care Suite",
        provider: "Dr. Sophia Patel",
        department: "Outpatient Clinic",
        scheduledAppointments: 1250,
        completedVisits: 1145,
        noShows: 58,
        cancellations: 47,
        avgWaitMinutes: 13.8,
        avgVisitDurationMinutes: 29.0,
        utilizationPct: 88.0,
      },
      {
        id: "ops-4",
        practice: "Satellite Care Network",
        location: "Satellite Care Center",
        provider: "Dr. Liam O'Connor",
        department: "Imaging & Radiology",
        scheduledAppointments: 1100,
        completedVisits: 1040,
        noShows: 35,
        cancellations: 25,
        avgWaitMinutes: 10.5,
        avgVisitDurationMinutes: 24.8,
        utilizationPct: 86.4,
      },
      {
        id: "ops-5",
        practice: "Main Campus Medical Center",
        location: "Main Campus Clinic",
        provider: "Dr. Rachel Green",
        department: "Outpatient Clinic",
        scheduledAppointments: 980,
        completedVisits: 890,
        noShows: 52,
        cancellations: 38,
        avgWaitMinutes: 16.5,
        avgVisitDurationMinutes: 27.4,
        utilizationPct: 81.5,
      },
      {
        id: "ops-6",
        practice: "Telehealth Care Services",
        location: "Telehealth Virtual Suite",
        provider: "Dr. Christopher Blake",
        department: "Telehealth",
        scheduledAppointments: 750,
        completedVisits: 680,
        noShows: 42,
        cancellations: 28,
        avgWaitMinutes: 3.2,
        avgVisitDurationMinutes: 18.2,
        utilizationPct: 76.0,
      },
    ],
    aiInsights: [
      {
        id: "ops-ai-1",
        headline: "Peak Throughput Observed Between 10:00 AM – 11:30 AM (120 Check-ins/Hour)",
        body: "Check-in volumes peak dramatically during morning mid-day slots, causing minor lobby queue congestion at Main Campus.",
        recommendation: "Implement digital self-service check-in kiosks and mobile pre-registration to flatten peak arrival surges.",
        category: "Peak Hours",
        estimatedImpact: 145000,
        confidence: 96,
        locationName: "Main Campus Clinic",
        type: "positive",
      },
      {
        id: "ops-ai-2",
        headline: "North Annex Orthopedics Average Wait Time Elevated at 19.2 Minutes",
        body: "Patient wait times at North Annex exceed target threshold by +4.2 minutes due to pre-procedure consent documentation delays.",
        recommendation: "Deploy electronic pre-visit consent forms via SMS 24 hours prior to orthopedic encounters.",
        category: "Excessive Wait Times",
        estimatedImpact: 92000,
        confidence: 92,
        locationName: "North Annex Orthopedics",
        type: "critical",
      },
      {
        id: "ops-ai-3",
        headline: "Telehealth Virtual Suite Operating Below Capacity at 76.0% Utilization",
        body: "Telehealth appointment slots exhibit an average 24% open capacity gap, primarily during 8:00 AM – 10:00 AM time blocks.",
        recommendation: "Offer same-day online booking and follow-up virtual appointments to fill early morning virtual slots.",
        category: "Low Provider Utilization",
        estimatedImpact: 68000,
        confidence: 89,
        locationName: "Telehealth Virtual Suite",
        type: "warning",
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export function getMockOperationalDetails(rowId: string) {
  const appointmentDetails: AppointmentDetailRow[] = [
    { id: "apt-1", appointmentNumber: "APT-2026-8801", patientName: "Eleanor Rigby", timeSlot: "09:00 AM", provider: "Dr. Eleanor Vance", status: "Completed", checkInTime: "08:52 AM", waitMinutes: 8 },
    { id: "apt-2", appointmentNumber: "APT-2026-8805", patientName: "Marcus Brody", timeSlot: "09:30 AM", provider: "Dr. Eleanor Vance", status: "Completed", checkInTime: "09:25 AM", waitMinutes: 12 },
    { id: "apt-3", appointmentNumber: "APT-2026-8812", patientName: "Arthur Dent", timeSlot: "10:00 AM", provider: "Dr. Eleanor Vance", status: "No Show", checkInTime: "—", waitMinutes: 0 },
    { id: "apt-4", appointmentNumber: "APT-2026-8820", patientName: "Clara Oswald", timeSlot: "10:30 AM", provider: "Dr. Eleanor Vance", status: "Checked In", checkInTime: "10:22 AM", waitMinutes: 14 },
  ];

  const providerSchedule: ProviderScheduleSlot[] = [
    { time: "08:00 AM", patientName: "Sarah Connor", visitType: "Follow-up Exam", status: "Completed", durationMinutes: 30 },
    { time: "08:30 AM", patientName: "Bruce Wayne", visitType: "New Patient Consultation", status: "Completed", durationMinutes: 45 },
    { time: "09:30 AM", patientName: "Diana Prince", visitType: "Diagnostic Review", status: "Completed", durationMinutes: 30 },
    { time: "10:00 AM", patientName: "Open Slot", visitType: "Available Slot", status: "Open", durationMinutes: 30 },
    { time: "10:30 AM", patientName: "Peter Parker", visitType: "Routine Checkup", status: "In Progress", durationMinutes: 30 },
  ];

  const departmentPerformance: DepartmentPerformanceDetail[] = [
    { department: "Outpatient Clinic", staffCount: 24, avgWaitMinutes: 12.5, completionRate: 94.2, utilizationPct: 89.5 },
    { department: "Surgical Suite", staffCount: 16, avgWaitMinutes: 19.2, completionRate: 92.0, utilizationPct: 91.2 },
    { department: "Imaging & Radiology", staffCount: 12, avgWaitMinutes: 10.5, completionRate: 96.5, utilizationPct: 86.4 },
    { department: "Telehealth", staffCount: 8, avgWaitMinutes: 3.2, completionRate: 90.7, utilizationPct: 76.0 },
  ];

  return { appointmentDetails, providerSchedule, departmentPerformance };
}
