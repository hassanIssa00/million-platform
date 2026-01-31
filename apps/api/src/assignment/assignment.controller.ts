import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  SubmitAssignmentDto,
  GradeSubmissionDto,
  AssignmentFilterDto,
} from './dto/assignment.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('assignments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @Request() req: any,
  ) {
    return this.assignmentService.create(createAssignmentDto, req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  findAll(@Query() filters: AssignmentFilterDto) {
    return this.assignmentService.findAll(filters);
  }

  @Get('my')
  @Roles(Role.TEACHER)
  findMyAssignments(@Request() req: any) {
    return this.assignmentService.findByTeacher(req.user.userId);
  }

  @Get('student')
  @Roles(Role.STUDENT)
  findStudentAssignments(@Request() req: any) {
    // Mock data for student assignments
    return [
      {
        id: '1',
        title: 'Calculus Problem Set 3',
        description: 'Complete problems 1-10 from Chapter 4. Show all work.',
        dueDate: '2024-12-10T23:59:00Z',
        subject: { name: 'Mathematics' },
        status: 'pending',
      },
      {
        id: '2',
        title: 'Physics Lab Report',
        description:
          'Submit the report for the pendulum experiment including data tables.',
        dueDate: '2024-12-08T23:59:00Z',
        subject: { name: 'Physics' },
        status: 'submitted',
      },
      {
        id: '3',
        title: 'History Essay',
        description:
          'Write a 500-word essay on the Industrial Revolution impact.',
        dueDate: '2024-12-01T23:59:00Z',
        subject: { name: 'History' },
        status: 'graded',
        grade: 92,
      },
      {
        id: '4',
        title: 'Chemistry Quiz Prep',
        description: 'Review Chapter 5 for upcoming quiz.',
        dueDate: '2024-12-12T23:59:00Z',
        subject: { name: 'Chemistry' },
        status: 'pending',
      },
    ];
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @Request() req: any,
  ) {
    return this.assignmentService.update(
      id,
      updateAssignmentDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.assignmentService.delete(id, req.user.userId);
  }

  @Post(':id/submit')
  @Roles(Role.STUDENT)
  submit(
    @Param('id') id: string,
    @Body() submitDto: SubmitAssignmentDto,
    @Request() req: any,
  ) {
    return this.assignmentService.submit(id, submitDto, req.user.userId);
  }

  @Get(':id/submissions')
  @Roles(Role.TEACHER, Role.ADMIN)
  getSubmissions(@Param('id') id: string, @Request() req: any) {
    return this.assignmentService.getSubmissions(id, req.user.userId);
  }

  @Patch('submissions/:id/grade')
  @Roles(Role.TEACHER, Role.ADMIN)
  gradeSubmission(
    @Param('id') id: string,
    @Body() gradeDto: GradeSubmissionDto,
    @Request() req: any,
  ) {
    return this.assignmentService.gradeSubmission(
      id,
      gradeDto,
      req.user.userId,
    );
  }
}
