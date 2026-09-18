import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Role, Roles } from '../../../common/decorators/roles.decorator';
import { StudentsService, StudentDto } from '../services/students.service';

@ApiTags('Students & Class Attendance (Domain 1)')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('classes/:className')
  @Roles(Role.MGR, Role.ADM)
  @ApiOperation({
    summary: 'Get Student Roster by Classroom',
    description: 'Returns real student list and allergy flags for attendance checklist.',
  })
  public async getRosterByClass(@Param('className') className: string): Promise<{ success: boolean; data: StudentDto[] }> {
    const data = await this.studentsService.getRosterByClass(className);
    return { success: true, data };
  }

  @Patch(':id/attendance')
  @Roles(Role.MGR, Role.ADM)
  @ApiOperation({
    summary: 'Update Student Attendance Status',
    description: 'Records PRESENT, EXCUSED_ABSENCE, or UNEXCUSED_ABSENCE for daily meal allocation.',
  })
  public async updateAttendance(
    @Param('id') studentId: string,
    @Body('status') status: 'PRESENT' | 'EXCUSED_ABSENCE' | 'UNEXCUSED_ABSENCE',
  ) {
    const data = await this.studentsService.updateAttendanceStatus(studentId, status);
    return { success: true, data };
  }
}
