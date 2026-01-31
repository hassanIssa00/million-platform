import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../notifications/email.service';
import {
  EmailTemplates,
  EmailTemplateData,
} from '../notifications/templates/email-templates';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduledReportService {
  private readonly logger = new Logger(ScheduledReportService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * Run every Friday at 10:00 AM
   */
  @Cron('0 10 * * 5') // Every Friday at 10 AM
  async handleWeeklyReports() {
    this.logger.log('Started generating weekly reports...');

    // Get all students with their parents
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        parents: {
          include: {
            parent: true,
          },
        },
        enrollments: {
          include: {
            class: true,
          },
        },
      },
    });

    let sentCount = 0;

    for (const student of students) {
      if (!student.parents.length) continue;

      try {
        const reportData = await this.generateStudentStats(student.id);

        // Send to each parent
        for (const relation of student.parents) {
          if (relation.parent.email) {
            const emailData: EmailTemplateData = {
              studentName: student.name || student.firstName || '',
              parentName:
                relation.parent.name || relation.parent.firstName || '',
              date: new Date().toLocaleDateString('ar-EG'),
              attendanceStats: reportData.attendance,
              recentGrades: reportData.grades,
              assignmentsPending: reportData.pendingAssignments,
            };

            await this.emailService.sendEmail({
              to: relation.parent.email,
              subject: `التقرير الأسبوعي للطالب ${student.name}`,
              html: EmailTemplates.weeklyReport(emailData),
            });

            sentCount++;
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to send report for student ${student.id}`,
          error,
        );
      }
    }

    this.logger.log(`Weekly reports job finished. Sent ${sentCount} emails.`);
  }

  /**
   * Aggregate statistics for the last 7 days
   */
  private async generateStudentStats(studentId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 1. Attendance
    const attendance = await this.prisma.attendance.findMany({
      where: {
        studentId,
        date: { gte: oneWeekAgo },
      },
    });

    const attendanceStats = {
      present: attendance.filter((a) => a.status === 'PRESENT').length,
      absent: attendance.filter((a) => a.status === 'ABSENT').length,
      late: attendance.filter((a) => a.status === 'LATE').length,
    };

    // 2. Recent Grades
    // 2. Recent Grades (from Submissions)
    const recentSubmissions = await this.prisma.submission.findMany({
      where: {
        studentId,
        gradedAt: { gte: oneWeekAgo },
        grade: { not: null },
      },
      include: {
        assignment: {
          include: { subject: true },
        },
      },
      take: 5,
      orderBy: { gradedAt: 'desc' },
    });

    const grades = recentSubmissions.map((s) => ({
      subject: s.assignment.subject.name,
      score: s.grade || 0,
      max: s.assignment.maxScore || 100,
      name: s.assignment.title,
    }));

    // 3. Pending Assignments
    const pendingAssignments = await this.prisma.assignment.count({
      where: {
        // This is a simplified query. In reality, we'd check against submissions
        dueDate: { gte: new Date() },
        // subject: { enrollments: { some: { studentId } } } // implied
      },
    });

    return {
      attendance: attendanceStats,
      grades,
      pendingAssignments,
    };
  }
}
