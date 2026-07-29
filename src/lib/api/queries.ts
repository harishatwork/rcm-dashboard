import { queryOptions } from "@tanstack/react-query";
import { rcmApi } from "./client";
import type { ClaimQuery } from "./types";
import type { EntityType, DrillLevel } from "./drilldown";

export const rcmQueries = {
  arDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "ar-dashboard"],
      queryFn: () => rcmApi.getArDashboard(),
    }),
  collectionsDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "collections-dashboard"],
      queryFn: () => rcmApi.getCollectionsDashboard(),
    }),
  revenueDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "revenue-dashboard"],
      queryFn: () => rcmApi.getRevenueDashboard(),
    }),
  billingStatus: () =>
    queryOptions({
      queryKey: ["rcm", "billing-status"],
      queryFn: () => rcmApi.getBillingStatus(),
    }),
  kpiDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "kpi-dashboard"],
      queryFn: () => rcmApi.getKpiDashboard(),
    }),
  executiveDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "executive-dashboard"],
      queryFn: () => rcmApi.getExecutiveDashboard(),
    }),
  kpis: () => queryOptions({ queryKey: ["rcm", "kpis"], queryFn: () => rcmApi.getKpis() }),
  revenueTrend: () =>
    queryOptions({ queryKey: ["rcm", "revenue-trend"], queryFn: () => rcmApi.getRevenueTrend() }),
  aging: () => queryOptions({ queryKey: ["rcm", "aging"], queryFn: () => rcmApi.getAging() }),
  claims: (query: ClaimQuery = {}) =>
    queryOptions({ queryKey: ["rcm", "claims", query], queryFn: () => rcmApi.getClaims(query) }),
  denials: () => queryOptions({ queryKey: ["rcm", "denials"], queryFn: () => rcmApi.getDenials() }),
  denialsDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "denials-dashboard"],
      queryFn: () => rcmApi.getDenialsDashboard(),
    }),
  insuranceDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "insurance-dashboard"],
      queryFn: () => rcmApi.getInsuranceDashboard(),
    }),
  patientAnalyticsDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "patient-analytics-dashboard"],
      queryFn: () => rcmApi.getPatientAnalyticsDashboard(),
    }),
  providerPerformanceDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "provider-performance-dashboard"],
      queryFn: () => rcmApi.getProviderPerformanceDashboard(),
    }),
  operationalDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "operational-dashboard"],
      queryFn: () => rcmApi.getOperationalDashboard(),
    }),
  reportsAnalyticsDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "reports-analytics-dashboard"],
      queryFn: () => rcmApi.getReportsAnalyticsDashboard(),
    }),
  predictiveAnalyticsDashboard: () =>
    queryOptions({
      queryKey: ["rcm", "predictive-analytics-dashboard"],
      queryFn: () => rcmApi.getPredictiveAnalyticsDashboard(),
    }),
  notifications: () =>
    queryOptions({
      queryKey: ["rcm", "notifications"],
      queryFn: () => rcmApi.getNotificationsData(),
    }),
  administration: () =>
    queryOptions({
      queryKey: ["rcm", "administration"],
      queryFn: () => rcmApi.getAdministrationData(),
    }),
  drilldown: (entityType: EntityType = "revenue", entityId: string = "root", level: DrillLevel = 1) =>
    queryOptions({
      queryKey: ["rcm", "drilldown", entityType, entityId, level],
      queryFn: () => rcmApi.getDrillDownData(entityType, entityId, level),
    }),
  personalization: () =>
    queryOptions({
      queryKey: ["rcm", "personalization"],
      queryFn: () => rcmApi.getPersonalizationData(),
    }),
  payers: () => queryOptions({ queryKey: ["rcm", "payers"], queryFn: () => rcmApi.getPayers() }),
  providers: () =>
    queryOptions({ queryKey: ["rcm", "providers"], queryFn: () => rcmApi.getProviders() }),
  encounters: () =>
    queryOptions({ queryKey: ["rcm", "encounters"], queryFn: () => rcmApi.getEncounters() }),
  productivity: () =>
    queryOptions({ queryKey: ["rcm", "productivity"], queryFn: () => rcmApi.getProductivity() }),
  forecast: () =>
    queryOptions({ queryKey: ["rcm", "forecast"], queryFn: () => rcmApi.getForecast() }),
  patientBalances: () =>
    queryOptions({
      queryKey: ["rcm", "patient-balances"],
      queryFn: () => rcmApi.getPatientBalances(),
    }),
  practices: () =>
    queryOptions({ queryKey: ["rcm", "practices"], queryFn: () => rcmApi.getPractices() }),
};
