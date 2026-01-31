import { Module } from '@nestjs/common';
import { examService } from './exam.service';
import { examController } from './exam.controller';

/**
 * Exam Module
 * Handles all exam-related functionality
 */
@Module({
  controllers: [examController as any],
  providers: [
    {
      provide: 'ExamService',
      useValue: examService,
    },
  ],
  exports: ['ExamService'],
})
export class ExamModule {}
