import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionCard } from "@/components/data/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Play,
  RefreshCw,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { rcmQueries } from "@/lib/api/queries";
import {
  CATEGORY_SLUGS,
  type ReportLibraryRow,
} from "@/lib/api/reports-analytics-dashboard";
import { ReportViewerModal } from "@/components/dashboard/ReportViewerModal";
import { ScheduleReportModal } from "@/components/dashboard/ScheduleReportModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reports_/$category")({
  head: ({ params }) => {
    const meta = CATEGORY_SLUGS[params.category] ?? {
      name: "Category Reports",
      title: "Report Library",
    };
    return {
      meta: [
        { title: `${meta.name} | RCM Analytics` },
        {
          name: "description",
          content: `Access, generate, schedule, and download ${meta.name} in RCM Analytics.`,
        },
      ],
    };
  },
  component: CategoryReportLibraryPage,
});

const ALL_CATEGORIES = [
  { slug: "financial", name: "Financial Reports" },
  { slug: "accounts-receivable", name: "Accounts Receivable" },
  { slug: "claims", name: "Claims Reports" },
  { slug: "denials", name: "Denials Reports" },
  { slug: "payments", name: "Payments Reports" },
  { slug: "patients", name: "Patient Reports" },
  { slug: "providers", name: "Provider Reports" },
  { slug: "operations", name: "Operational Reports" },
];

export function CategoryReportLibraryPage() {
  const { category: categorySlug } = Route.useParams();
  const navigate = useNavigate();
  const query = useQuery(rcmQueries.reportsAnalyticsDashboard());

  const categoryMeta = CATEGORY_SLUGS[categorySlug] ?? {
    slug: categorySlug,
    name: categorySlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    title: "Report Library",
  };

  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Action states
  const [selectedReportForViewer, setSelectedReportForViewer] = useState<ReportLibraryRow | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [selectedReportForSchedule, setSelectedReportForSchedule] = useState<ReportLibraryRow | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);
  const [simulatedError, setSimulatedError] = useState(false);

  const isLoading = query.isLoading;
  const isError = query.isError;
  const data = query.data;

  // Filter & match reports for this category
  const filteredReports = useMemo(() => {
    if (!data) return [];
    let rows = data.libraryRows.filter(
      (r) =>
        r.categorySlug === categorySlug ||
        r.category.toLowerCase().includes(categoryMeta.name.toLowerCase().replace(" reports", "")),
    );

    // If empty for exact slug, provide fallback rows for demonstration
    if (rows.length === 0 && data.libraryRows.length > 0) {
      rows = data.libraryRows.slice(0, 4).map((r, idx) => ({
        ...r,
        id: `${r.id}-${categorySlug}`,
        category: categoryMeta.name,
        categorySlug,
        reportName: `${categoryMeta.name} #${idx + 1} - ${r.reportName}`,
      }));
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      rows = rows.filter(
        (r) =>
          r.reportName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.generatedBy.toLowerCase().includes(q),
      );
    }

    // Format filter
    if (formatFilter !== "ALL") {
      rows = rows.filter((r) => r.format.toUpperCase() === formatFilter);
    }

    // Status filter
    if (statusFilter !== "ALL") {
      rows = rows.filter((r) => r.status.toUpperCase() === statusFilter.toUpperCase());
    }

    // Sorting
    rows = [...rows].sort((a, b) => {
      if (sortBy === "name-asc") return a.reportName.localeCompare(b.reportName);
      if (sortBy === "name-desc") return b.reportName.localeCompare(a.reportName);
      if (sortBy === "format") return a.format.localeCompare(b.format);
      return 0;
    });

    return rows;
  }, [data, categorySlug, categoryMeta.name, search, formatFilter, statusFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredReports.length / pageSize) || 1;
  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  // Handlers
  const handleOpenViewer = (report: ReportLibraryRow) => {
    setSelectedReportForViewer(report);
    setViewerOpen(true);
  };

  const handleOpenSchedule = (report: ReportLibraryRow) => {
    setSelectedReportForSchedule(report);
    setScheduleOpen(true);
  };

  const handleGenerate = (report: ReportLibraryRow) => {
    setGeneratingReportId(report.id);

    setTimeout(() => {
      setGeneratingReportId(null);
      if (simulatedError) {
        toast.error(`Failed to generate “${report.reportName}”`, {
          description: "Database connection timeout. Please click Retry.",
          action: {
            label: "Retry",
            onClick: () => handleGenerate(report),
          },
        });
      } else {
        toast.success(`Generated “${report.reportName}” successfully`, {
          description: `Snapshot created at ${new Date().toLocaleTimeString()} by System User.`,
        });
      }
    }, 1200);
  };

  const handleDownload = (report: ReportLibraryRow) => {
    toast.info(`Preparing ${report.format} download for “${report.reportName}”…`, {
      description: "File will save to your downloads folder.",
    });

    setTimeout(() => {
      toast.success(`Downloaded ${report.reportName}.${report.format.toLowerCase()}`);
    }, 800);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/reports" })}
            className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reports Overview
          </Button>

          {/* Quick Category Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ALL_CATEGORIES.map((cat) => {
              const active = cat.slug === categorySlug;
              return (
                <Link
                  key={cat.slug}
                  to="/reports/$category"
                  params={{ category: cat.slug }}
                  className={cn(
                    "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-brand"
                      : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {cat.name.replace(" Reports", "")}
                </Link>
              );
            })}
          </div>
        </div>

        <PageHeader
          title={categoryMeta.name}
          description={`Dedicated Report Library for ${categoryMeta.name}. Generate on-demand snapshots, schedule recurring email/SFTP runs, and download historical data.`}
        />

        {/* Error State */}
        {isError ? (
          <div className="mx-auto my-12 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">
              Failed to load category reports
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              An error occurred while connecting to the analytics server. Please check your network or try again.
            </p>
            <Button variant="outline" className="mt-6 gap-2 rounded-xl" onClick={() => query.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Retry loading
            </Button>
          </div>
        ) : null}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        ) : null}

        {/* Main Category Library Content */}
        {!isLoading && !isError && data ? (
          <div className="space-y-6">
            {/* Search, Filter, Sort & Controls Rail */}
            <SectionCard className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Search Bar */}
                <div className="relative min-w-[260px] flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={`Search ${categoryMeta.name.toLowerCase()}...`}
                    className="h-10 rounded-xl pl-9"
                  />
                  {search ? (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Select value={formatFilter} onValueChange={(v) => { setFormatFilter(v); setCurrentPage(1); }}>
                      <SelectTrigger className="h-10 w-[140px] rounded-xl">
                        <SelectValue placeholder="Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Formats</SelectItem>
                        <SelectItem value="PDF">PDF Document</SelectItem>
                        <SelectItem value="EXCEL">Excel (.xlsx)</SelectItem>
                        <SelectItem value="CSV">CSV Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                    <SelectTrigger className="h-10 w-[140px] rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Statuses</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-10 w-[160px] rounded-xl">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">Name (A – Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z – A)</SelectItem>
                        <SelectItem value="format">File Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dev Toggle for Simulated Error State */}
                  <Button
                    variant={simulatedError ? "destructive" : "outline"}
                    size="sm"
                    className="h-10 gap-1.5 rounded-xl text-xs"
                    onClick={() => {
                      setSimulatedError((prev) => !prev);
                      toast.info(
                        !simulatedError
                          ? "Generation error simulation enabled (Click Generate to test error state)"
                          : "Generation error simulation disabled (Normal success mode)",
                      );
                    }}
                  >
                    {simulatedError ? "Error Mode ON" : "Simulate Error"}
                  </Button>
                </div>
              </div>
            </SectionCard>

            {/* Empty State */}
            {filteredReports.length === 0 ? (
              <div className="mx-auto my-8 max-w-md rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground/60" />
                <h4 className="mt-3 font-display text-base font-semibold">No reports match your filters</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try clearing your search query or adjusting the format/status filter criteria.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl"
                  onClick={() => {
                    setSearch("");
                    setFormatFilter("ALL");
                    setStatusFilter("ALL");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : null}

            {/* Reports List Table */}
            {filteredReports.length > 0 ? (
              <SectionCard
                title={`Available ${categoryMeta.name} (${filteredReports.length})`}
                subtitle="Execute on-demand runs, preview sample data, trigger dispatches, or configure recurring schedules."
              >
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                        <TableHead className="font-bold">Report Name & Description</TableHead>
                        <TableHead className="w-[140px] font-bold">Last Generated</TableHead>
                        <TableHead className="w-[110px] font-bold">Format</TableHead>
                        <TableHead className="w-[100px] font-bold">Status</TableHead>
                        <TableHead className="w-[320px] text-right font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedReports.map((report) => {
                        const isGenerating = generatingReportId === report.id;

                        return (
                          <TableRow key={report.id} className="group hover:bg-muted/40 transition-colors">
                            <TableCell className="align-top py-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                    {report.reportName}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                                  {report.description}
                                </p>
                                <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Schedule: {report.schedule}
                                  </span>
                                  <span>•</span>
                                  <span>By: {report.generatedBy}</span>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="align-top py-4 text-xs font-medium text-muted-foreground">
                              {report.lastGenerated}
                            </TableCell>

                            <TableCell className="align-top py-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "font-mono text-[11px] font-semibold",
                                  report.format === "PDF" && "border-red-500/30 text-red-600 bg-red-500/10",
                                  report.format === "Excel" && "border-emerald-500/30 text-emerald-600 bg-emerald-500/10",
                                  report.format === "CSV" && "border-blue-500/30 text-blue-600 bg-blue-500/10",
                                )}
                              >
                                {report.format}
                              </Badge>
                            </TableCell>

                            <TableCell className="align-top py-4">
                              <Badge
                                variant={report.status === "Active" ? "secondary" : "outline"}
                                className="text-[11px]"
                              >
                                {report.status}
                              </Badge>
                            </TableCell>

                            <TableCell className="align-top py-4 text-right">
                              <div className="flex flex-wrap items-center justify-end gap-1.5">
                                {/* View Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1 rounded-lg text-xs"
                                  onClick={() => handleOpenViewer(report)}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View
                                </Button>

                                {/* Generate Button */}
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  disabled={isGenerating}
                                  className="h-8 gap-1 rounded-lg text-xs"
                                  onClick={() => handleGenerate(report)}
                                >
                                  {isGenerating ? (
                                    <>
                                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-3.5 w-3.5 fill-current" />
                                      Generate
                                    </>
                                  )}
                                </Button>

                                {/* Download Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1 rounded-lg text-xs"
                                  onClick={() => handleDownload(report)}
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  Download
                                </Button>

                                {/* Schedule Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1 rounded-lg text-xs"
                                  onClick={() => handleOpenSchedule(report)}
                                >
                                  <Calendar className="h-3.5 w-3.5" />
                                  Schedule
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
                  <span>
                    Showing {Math.min((currentPage - 1) * pageSize + 1, filteredReports.length)} to{" "}
                    {Math.min(currentPage * pageSize, filteredReports.length)} of {filteredReports.length} reports
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="h-8 rounded-lg"
                    >
                      Previous
                    </Button>
                    <span className="font-semibold text-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="h-8 rounded-lg"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </SectionCard>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Interactive Report Viewer Modal */}
      <ReportViewerModal
        report={selectedReportForViewer}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />

      {/* Interactive Schedule Configuration Modal */}
      <ScheduleReportModal
        report={selectedReportForSchedule}
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
      />
    </AppShell>
  );
}
