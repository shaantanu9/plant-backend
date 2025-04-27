import { z } from 'zod';

// Data point schema for charts
const DataPointSchema = z.object({
  label: z.string(),
  value: z.number(),
  date: z.date().optional(),
});

// Chart schema
const ChartSchema = z.object({
  type: z.enum(['bar', 'line', 'pie', 'area', 'scatter']),
  title: z.string(),
  data: z.array(DataPointSchema),
  xAxisLabel: z.string().optional(),
  yAxisLabel: z.string().optional(),
});

// Table schema
const TableRowSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]));

const TableSchema = z.object({
  title: z.string(),
  headers: z.array(z.string()),
  rows: z.array(TableRowSchema),
});

// Main Report schema
export const ReportSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['sales', 'inventory', 'delivery', 'user', 'subscription', 'financial', 'custom']),
  dateRange: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
  createdBy: z.string(),
  charts: z.array(ChartSchema).optional(),
  tables: z.array(TableSchema).optional(),
  metrics: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
  filters: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])).optional(),
  format: z.enum(['pdf', 'excel', 'csv', 'json', 'html']).default('pdf'),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
    dayOfWeek: z.number().min(0).max(6).optional(),
    dayOfMonth: z.number().min(1).max(31).optional(),
    time: z.string(),
    recipients: z.array(z.string().email()),
  }).optional(),
  isPublic: z.boolean().default(false),
  accessUsers: z.array(z.string()).optional(),
  accessRoles: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create Report schema
export const CreateReportSchema = ReportSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
}).required({
  title: true,
  type: true,
  dateRange: true,
  createdBy: true,
});

// Update Report schema
export const UpdateReportSchema = ReportSchema.partial().omit({
  _id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});