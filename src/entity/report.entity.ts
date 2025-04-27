import { Model } from 'mongoose';
import { toObjectId } from '@utils';
import ReportModel from '../models/report.model';
import BaseEntity from './base.entity';

class ReportEntity extends BaseEntity {
  constructor(model: Model<any>) {
    super(model);
  }

  // Basic CRUD operations

  // Add a new report
  public async addReport(data: any) {
    return this.create(data);
  }

  // Get report by type and date
  public async getReportByTypeAndDate(type: string, date: Date) {
    return this.findOne({ type, date });
  }

  // Get all reports of a specific type
  public async getReportsByType(type: string) {
    return this.find({ type });
  }

  // Get reports within a date range
  public async getReportsWithinDateRange(startDate: Date, endDate: Date, status: string) {
    return this.find({
      status: status,
      date: { $gte: startDate, $lte: endDate },
    });
  }

  // Get reports with pending deliveries
  public async getReportsWithPendingContainers(thresholdNumber: number) {
    return this.find({ pendingContainers: { $gt: thresholdNumber } });
  }

  // Modify report by type and date
  public async modifyReportByTypeAndDate(type: string, date: Date, updates: any) {
    return this.updateOne({ type, date }, updates);
  }

  // Remove a report by type and date
  public async removeReportByTypeAndDate(type: string, date: Date) {
    return this.deleteOne({ type, date });
  }

  // Enhanced report functions

  // Generate a daily report for a specific date
  public async generateDailyReport(
    date: Date,
    deliveryData: any[],
    containerData: any[],
    adminId: string,
  ) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Calculate metrics from delivery and container data
    const totalDeliveries = deliveryData.length;
    const completedDeliveries = deliveryData.filter(d => d.status === 'completed').length;
    const missedDeliveries = deliveryData.filter(d => d.status === 'missed').length;

    const containersDelivered = deliveryData.reduce(
      (sum, d) => sum + (d.containersDelivered || 0),
      0,
    );
    const containersReturned = deliveryData.reduce(
      (sum, d) => sum + (d.containersReturned || 0),
      0,
    );

    // Determine pending containers from container data
    const pendingContainers = containerData.filter(c => c.status === 'with-subscriber').length;

    // Generate subscriber details
    const subscriberDetails = this.generateSubscriberDetails(deliveryData, containerData, adminId);

    const reportData = {
      type: 'daily',
      date: startOfDay,
      totalDeliveries,
      completedDeliveries,
      missedDeliveries,
      containersDelivered,
      containersReturned,
      pendingContainers,
      subscriberDetails,
    };

    // Upsert to ensure one report per day
    return this.model.findOneAndUpdate({ type: 'daily', date: startOfDay }, reportData, {
      upsert: true,
      new: true,
    });
  }

  // Generate a weekly report for a specific date range
  public async generateWeeklyReport(startDate: Date, endDate: Date, adminId: string) {
    // Set the report date to the first day of the week
    const reportDate = new Date(startDate);

    // Get daily reports for the week
    const dailyReports: any[] = await this.find({
      type: 'daily',
      date: { $gte: startDate, $lte: endDate },
    });

    if (dailyReports.length === 0) {
      return null; // No data to generate weekly report
    }

    // Aggregate metrics from daily reports
    const totalDeliveries = dailyReports.reduce((sum, r) => sum + r.totalDeliveries, 0);
    const completedDeliveries = dailyReports.reduce((sum, r) => sum + r.completedDeliveries, 0);
    const missedDeliveries = dailyReports.reduce((sum, r) => sum + r.missedDeliveries, 0);
    const containersDelivered = dailyReports.reduce((sum, r) => sum + r.containersDelivered, 0);
    const containersReturned = dailyReports.reduce((sum, r) => sum + r.containersReturned, 0);

    // Get the latest pending containers count
    const latestDaily = dailyReports.sort((a, b) => b.date - a.date)[0] as any;
    const pendingContainers = latestDaily.pendingContainers;

    // Aggregate subscriber details
    const subscriberDetailsMap = new Map();
    dailyReports.forEach(report => {
      (report as any).subscriberDetails.forEach((detail: any) => {
        const subscriberId = detail.subscriberId.toString();
        if (subscriberDetailsMap.has(subscriberId)) {
          const existing = subscriberDetailsMap.get(subscriberId);
          subscriberDetailsMap.set(subscriberId, {
            subscriberId: detail.subscriberId,
            name: detail.name,
            deliveries: existing.deliveries + detail.deliveries,
            containers: detail.containers, // Use the latest
            returned: existing.returned + detail.returned,
            pending: detail.pending, // Use the latest
            value: existing.value + detail.value,
          });
        } else {
          subscriberDetailsMap.set(subscriberId, { ...detail });
        }
      });
    });

    const subscriberDetails = Array.from(subscriberDetailsMap.values());

    const reportData = {
      type: 'weekly',
      date: reportDate,
      totalDeliveries,
      completedDeliveries,
      missedDeliveries,
      containersDelivered,
      containersReturned,
      pendingContainers,
      subscriberDetails,
    };

    // Upsert to ensure one report per week
    return this.model.findOneAndUpdate({ type: 'weekly', date: reportDate }, reportData, {
      upsert: true,
      new: true,
    });
  }

  // Generate a monthly report
  public async generateMonthlyReport(year: number, month: number, adminId: any) {
    // Create start and end date for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of month

    // Get weekly reports for the month
    const weeklyReports = await this.find({
      type: 'weekly',
      date: { $gte: startDate, $lte: endDate },
    });

    if (weeklyReports.length === 0) {
      // Fallback to daily reports if no weekly reports
      const dailyReports = await this.find({
        type: 'daily',
        date: { $gte: startDate, $lte: endDate },
      });

      if (dailyReports.length === 0) {
        return null; // No data to generate monthly report
      }

      // Aggregate from daily reports
      // (similar aggregation logic as the weekly report generation)
      // ...
    }

    // Aggregate metrics from weekly reports (similar to how weekly aggregates dailies)
    const totalDeliveries = weeklyReports.reduce((sum, r: any) => sum + r.totalDeliveries, 0);
    const completedDeliveries = weeklyReports.reduce(
      (sum, r: any) => sum + r.completedDeliveries,
      0,
    );
    const missedDeliveries = weeklyReports.reduce((sum, r: any) => sum + r.missedDeliveries, 0);
    const containersDelivered = weeklyReports.reduce(
      (sum, r: any) => sum + r.containersDelivered,
      0,
    );
    const containersReturned = weeklyReports.reduce((sum, r: any) => sum + r.containersReturned, 0);

    // Get the latest pending containers count
    const latestWeekly = weeklyReports.sort((a: any, b: any) => b.date - a.date)[0];
    const pendingContainers = (latestWeekly as any).pendingContainers;

    // Aggregate subscriber details (similar to weekly report logic)
    const subscriberDetailsMap = new Map();
    weeklyReports.forEach(report => {
      (report as any).subscriberDetails.forEach((detail: any) => {
        // Aggregation logic...
        // ...
      });
    });

    const subscriberDetails = Array.from(subscriberDetailsMap.values());

    const reportData = {
      type: 'monthly',
      date: startDate,
      totalDeliveries,
      completedDeliveries,
      missedDeliveries,
      containersDelivered,
      containersReturned,
      pendingContainers,
      subscriberDetails,
    };

    // Upsert to ensure one report per month
    return this.model.findOneAndUpdate({ type: 'monthly', date: startDate }, reportData, {
      upsert: true,
      new: true,
    });
  }

  // Helper to generate subscriber details from raw data
  private generateSubscriberDetails(deliveryData: any[], containerData: any[], adminId: string) {
    const subscriberMap = new Map();

    // Process delivery data
    deliveryData.forEach(delivery => {
      const subscriberId = delivery.subscriberId.toString();
      const subscriber = subscriberMap.get(subscriberId) || {
        subscriberId: delivery.subscriberId,
        name: delivery.subscriberName || 'Unknown', // This might need to be populated from elsewhere
        deliveries: 0,
        containers: 0,
        returned: 0,
        pending: 0,
        value: 0,
      };

      subscriber.deliveries += 1;
      subscriber.containers += delivery.containersDelivered || 0;
      subscriber.returned += delivery.containersReturned || 0;

      // Assuming some value calculation based on deliveries
      subscriber.value += 10; // Placeholder value calculation

      subscriberMap.set(subscriberId, subscriber);
    });

    // Process container data to get pending counts
    containerData.forEach(container => {
      const subscriberId = container.subscriberId.toString();
      if (subscriberMap.has(subscriberId)) {
        const subscriber = subscriberMap.get(subscriberId);
        if (container.status === 'with-subscriber') {
          subscriber.pending += 1;
        }
        subscriberMap.set(subscriberId, subscriber);
      }
    });

    return Array.from(subscriberMap.values());
  }

  // Get container return efficiency for a report
  public async getContainerReturnEfficiency(reportId: string) {
    const report: any = await this.findOne({ _id: toObjectId(reportId) });

    if (!report) return null;

    const efficiency = {
      delivered: report.containersDelivered,
      returned: report.containersReturned,
      pending: report.pendingContainers,
      returnRate:
        report.containersDelivered > 0
          ? (report.containersReturned / report.containersDelivered) * 100
          : 0,
    };

    return efficiency;
  }

  // Get subscriber report for a specific subscriber
  public async getSubscriberReport(subscriberId: string, startDate: Date, endDate: Date) {
    const reports: any = await this.find({
      date: { $gte: startDate, $lte: endDate },
      'subscriberDetails.subscriberId': toObjectId(subscriberId),
    });

    if (reports.length === 0) return null;

    // Extract and aggregate this subscriber's data from all reports
    const subscriberData = reports
      .map((report: any) => {
        const details = report.subscriberDetails.find(
          (d: any) => d.subscriberId.toString() === subscriberId,
        );

        return {
          date: report.date,
          type: report.type,
          details: details || null,
        };
      })
      .filter((item: any) => item.details !== null);

    // Calculate aggregated metrics
    const totalDeliveries = subscriberData.reduce(
      (sum: any, item: any) => sum + item.details.deliveries,
      0,
    );
    const totalContainers = subscriberData.reduce(
      (sum: any, item: any) => sum + item.details.containers,
      0,
    );
    const totalReturned = subscriberData.reduce(
      (sum: any, item: any) => sum + item.details.returned,
      0,
    );

    // Get the latest pending value
    const latestReport = subscriberData.sort((a: any, b: any) => b.date - a.date)[0];
    const pendingContainers = latestReport ? latestReport.details.pending : 0;

    // Calculate return rate
    const returnRate = totalContainers > 0 ? (totalReturned / totalContainers) * 100 : 0;

    return {
      subscriberId,
      reports: subscriberData,
      summary: {
        totalDeliveries,
        totalContainers,
        totalReturned,
        pendingContainers,
        returnRate,
      },
    };
  }

  // Get delivery performance by zone
  public async getPerformanceByZone(type: string, date: Date, zones: string[]) {
    const report: any = await this.getReportByTypeAndDate(type, date);
    if (!report) return null;

    // This would require subscriber zone data, which might need to be populated
    // For now, we'll return a placeholder implementation
    return {
      date: report.date,
      type: report.type,
      zones: zones.map(zone => ({
        zone,
        totalDeliveries: 0, // Would need to be calculated based on subscribers in zone
        completionRate: 0,
        containerReturnRate: 0,
      })),
    };
  }

  // Get trend analysis across multiple reports
  public async getTrendAnalysis(type: string, startDate: Date, endDate: Date) {
    const reports: any = await this.find({
      type,
      date: { $gte: startDate, $lte: endDate },
    });
    // .sort({ date: 1 });

    if (reports.length === 0) return [];

    return reports.map((report: any) => ({
      date: report.date,
      totalDeliveries: report.totalDeliveries,
      completedDeliveries: report.completedDeliveries,
      missedDeliveries: report.missedDeliveries,
      containersDelivered: report.containersDelivered,
      containersReturned: report.containersReturned,
      pendingContainers: report.pendingContainers,
      completionRate:
        report.totalDeliveries > 0
          ? (report.completedDeliveries / report.totalDeliveries) * 100
          : 0,
      returnRate:
        report.containersDelivered > 0
          ? (report.containersReturned / report.containersDelivered) * 100
          : 0,
    }));
  }

  // Get top performing subscribers
  public async getTopPerformingSubscribers(type: string, date: Date, limit: number = 10) {
    const report: any = await this.getReportByTypeAndDate(type, date);
    if (!report) return [];

    // Sort subscriber details by return rate
    const sortedSubscribers = [...report.subscriberDetails]
      .filter(sub => sub.containers > 0) // Only include subscribers with container deliveries
      .map(sub => ({
        ...sub,
        returnRate: sub.containers > 0 ? (sub.returned / sub.containers) * 100 : 0,
      }))
      .sort((a, b) => b.returnRate - a.returnRate)
      .slice(0, limit);

    return sortedSubscribers;
  }

  // Get worst performing subscribers (lowest return rates)
  public async getWorstPerformingSubscribers(type: string, date: Date, limit: number = 10) {
    const report: any = await this.getReportByTypeAndDate(type, date);
    if (!report) return [];

    // Sort subscriber details by return rate (ascending)
    const sortedSubscribers = [...report.subscriberDetails]
      .filter(sub => sub.containers > 0) // Only include subscribers with container deliveries
      .map(sub => ({
        ...sub,
        returnRate: sub.containers > 0 ? (sub.returned / sub.containers) * 100 : 0,
      }))
      .sort((a, b) => a.returnRate - b.returnRate)
      .slice(0, limit);

    return sortedSubscribers;
  }

  // Update subscriber detail in a report
  public async updateSubscriberDetail(reportId: string, subscriberId: string, updates: any) {
    return this.model.findOneAndUpdate(
      {
        _id: toObjectId(reportId),
        'subscriberDetails.subscriberId': toObjectId(subscriberId),
      },
      { $set: { 'subscriberDetails.$': updates } },
      { new: true },
    );
  }

  // Add subscriber to report
  public async addSubscriberToReport(reportId: string, subscriberDetail: any) {
    return this.model.findByIdAndUpdate(
      toObjectId(reportId),
      { $push: { subscriberDetails: subscriberDetail } },
      { new: true },
    );
  }

  // Remove subscriber from report
  public async removeSubscriberFromReport(reportId: string, subscriberId: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(reportId),
      {
        $pull: {
          subscriberDetails: { subscriberId: toObjectId(subscriberId) },
        },
      },
      { new: true },
    );
  }

  // Generate a dashboard summary
  public async generateDashboardSummary(period: string = 'last30days') {
    const endDate = new Date();
    let startDate: Date;

    switch (period) {
      case 'last7days':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'last30days':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'last90days':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
    }

    // Get all daily reports in the period
    const reports: any = await this.find({
      type: 'daily',
      date: { $gte: startDate, $lte: endDate },
    });

    if (reports.length === 0) return null;

    // Aggregate metrics
    const totalDeliveries = reports.reduce((sum: any, r: any) => sum + r.totalDeliveries, 0);
    const completedDeliveries = reports.reduce(
      (sum: any, r: any) => sum + r.completedDeliveries,
      0,
    );
    const missedDeliveries = reports.reduce((sum: any, r: any) => sum + r.missedDeliveries, 0);
    const containersDelivered = reports.reduce(
      (sum: any, r: any) => sum + r.containersDelivered,
      0,
    );
    const containersReturned = reports.reduce((sum: any, r: any) => sum + r.containersReturned, 0);

    // Get the latest pending containers count
    const latestReport: any = reports.sort((a: any, b: any) => b.date - a.date)[0];
    const pendingContainers = latestReport.pendingContainers;

    // Calculate rates
    const completionRate = totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;
    const returnRate =
      containersDelivered > 0 ? (containersReturned / containersDelivered) * 100 : 0;

    return {
      period,
      startDate,
      endDate,
      metrics: {
        totalDeliveries,
        completedDeliveries,
        missedDeliveries,
        containersDelivered,
        containersReturned,
        pendingContainers,
        completionRate,
        returnRate,
      },
    };
  }

  // getReportById
  public async getReportById(reportId: string) {
    return this.findOne({ _id: toObjectId(reportId) });
  }

  // updateReportById
  public async updateReportById(reportId: string, updates: any) {
    return this.updateOne({ _id: toObjectId(reportId) }, updates);
  }

  // removeReportById
  public async removeReportById(reportId: string) {
    return this.deleteOne({ _id: toObjectId(reportId) });
  }

  // generateQuarterlyReport
}

export const ReportEntities = new ReportEntity(ReportModel);
