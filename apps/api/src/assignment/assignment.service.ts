import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  SubmitAssignmentDto,
  GradeSubmissionDto,
} from './dto/assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAssignmentDto, teacherId: string) {
    // Verify teacher teaches this subject
    const subject = await this.prisma.subject.findUnique({
      where: { id: data.subjectId },
      include: { teacher: true },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (subject.teacherId !== teacherId) {
      throw new ForbiddenException('You do not teach this subject');
    }

    return this.prisma.assignment.create({
      data: {
        ...data,
        teacherId,
        maxScore: data.maxScore || 100,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        teacher: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(filters: { subjectId?: string } = {}) {
    const where: any = {};

    if (filters.subjectId) {
      where.subjectId = filters.subjectId;
    }

    return this.prisma.assignment.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.assignment.findMany({
      where: { teacherId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStudent(studentId: string) {
    // Get student's enrolled classes
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        class: {
          include: {
            subjects: {
              include: {
                assignments: {
                  include: {
                    subject: true,
                    submissions: {
                      where: { studentId },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Flatten assignments
    const assignments = enrollments.flatMap((enrollment) =>
      enrollment.class.subjects.flatMap((subject) =>
        subject.assignments.map((assignment) => ({
          ...assignment,
          submission: assignment.submissions[0] || null,
        })),
      ),
    );

    return assignments;
  }

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async update(id: string, data: UpdateAssignmentDto, teacherId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.teacherId !== teacherId) {
      throw new ForbiddenException('You can only edit your own assignments');
    }

    return this.prisma.assignment.update({
      where: { id },
      data,
      include: {
        subject: true,
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string, teacherId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.teacherId !== teacherId) {
      throw new ForbiddenException('You can only delete your own assignments');
    }

    return this.prisma.assignment.delete({
      where: { id },
    });
  }

  async submit(
    assignmentId: string,
    data: SubmitAssignmentDto,
    studentId: string,
  ) {
    // Check if assignment exists
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if already submitted
    const existing = await this.prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId,
        },
      },
    });

    if (existing) {
      // Update existing submission
      return this.prisma.submission.update({
        where: { id: existing.id },
        data: {
          content: data.content,
          attachments: data.attachments || [],
          submittedAt: new Date(),
        },
      });
    }

    // Create new submission
    return this.prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        content: data.content,
        attachments: data.attachments || [],
      },
    });
  }

  async getSubmissions(assignmentId: string, teacherId: string) {
    // Verify teacher owns this assignment
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You can only view submissions for your assignments',
      );
    }

    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async gradeSubmission(
    submissionId: string,
    data: GradeSubmissionDto,
    teacherId: string,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.assignment.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You can only grade submissions for your assignments',
      );
    }

    return this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: data.score,
        feedback: data.feedback,
        gradedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
