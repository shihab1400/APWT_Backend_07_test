import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Put,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { PaidPatientService } from './paidpatient.service';
import {
  PaidPatientDto,
  PaidPatientUpdateDto,
  UpdatePasswordDto,
} from './paidpatient.dto';
import { PaidPatientEntity } from './paidpatient.entity';
import { AdminEntity } from 'src/admin/admin.entity';
import { PaidPatientAuthGuard } from './paidpatientAuth/paidpatientAuth.guard';

@Controller('paid-patient')
// @UseGuards(PaidPatientAuthGuard)
export class PaidPatientController {
  constructor(private readonly paidPatientService: PaidPatientService) {}

  @UseGuards(PaidPatientAuthGuard)
  @Get('all-patients')
  getAllpatients(): Promise<PaidPatientEntity[]> {
    return this.paidPatientService.getAllPatients();
  }

  @Get('fullName/:fullName')
  getPatientByFullName(
    @Param('fullName') fullName: string,
  ): Promise<PaidPatientEntity[]> {
    return this.paidPatientService.getPatientByFullName(fullName);
  }

  @Get('getpatientbyusername/:username')
  getPatientByUsername(
    @Param('username') username: string,
  ): Promise<PaidPatientEntity> {
    return this.paidPatientService.getPatientByUsername(username);
  }

  @Get('getadmininfobypatientid/:id')
  getAdminInfoByPatientId(@Param('id') id: string): Promise<AdminEntity> {
    return this.paidPatientService.getAdminInfoByPatientId(id);
  }

  @Get('getpatientbyusernamewithoutpassword/:username')
  getPatientByUsernameWithoutPassword(
    @Param('username') username: string,
  ): Promise<object> {
    return this.paidPatientService.getPatientByUsernameWithoutPassword(
      username,
    );
  }

  @Get('getpatientbyusernamewithoutspecific/:username')
  getPatientByUsernameWithoutSpecific(
    @Param('username') username: string,
  ): Promise<object> {
    return this.paidPatientService.getPatientByUsernameWithoutSpecific(
      username,
    );
  }

  @Delete('delete-record/:username')
  deleteRecord(@Param('username') username: string): Promise<object> {
    return this.paidPatientService.deleteRecord(username);
  }

  @Get('chat-history')
  getChatHistory(): object {
    return this.paidPatientService.getChatHistory();
  }

  @Get('assessment-quiz')
  getAssessmentQuiz(): object {
    return this.paidPatientService.getAssessmentQuiz();
  }

  @Get('appointment-details/:id')
  getAppointmentDetails(@Param('id') id: string): object {
    return this.paidPatientService.getAppointmentDetails(Number(id));
  }

  @Get('payment-records')
  getPaymentRecords(
    @Query('userId') userId: string,
    @Query('type') type: string,
  ): object {
    return this.paidPatientService.getPaymentRecords(Number(userId), type);
  }

  // @UseInterceptors(
  //FileInterceptor('file', {
  // fileFilter: (req, file, cb) => {
  // if (file.originalname.match(/^.*\.pdf$/)) {
  // cb(null, true);
  //} else {
  //cb(
  //new MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF allowed'),
  //false,
  //);
  //}
  //},
  //storage: diskStorage({
  //destination: './upload',
  //filename: (req, file, cb) => {
  //cb(null, Date.now() + '-' + file.originalname);
  //},
  //}),
  //}),
  //)
  //@UsePipes(new ValidationPipe())
  //@Post('create-record')
  //createRecord(
  //@Body() dto: PaidPatientDto,
  //@UploadedFile() file: Express.Multer.File,
  //): object {
  //dto.file = file?.filename;
  //return this.paidPatientService.createRecord(dto);
  //}

  @Put('update-record/:id')
  updateRecord(@Param('id') id: string, @Body() dto: PaidPatientDto): object {
    return this.paidPatientService.updateRecord(id, dto);
  }

  @Patch('update-password/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
  ): object {
    return this.paidPatientService.updatePassword(id, dto);
  }

  @Get('allpatientsforfrontend')
  allpatientsforfrontend(): Promise<object[]> {
    return this.paidPatientService.allpatientsforfrontend();
  }

  @Delete('deletepatient/:id')
  deletePatientForFrontend(@Param('id') id: string): Promise<object> {
    return this.paidPatientService.deletePatientForFrontend(id);
  }

  @Put('updaterecordforfrontend/:id')
  updateRecordForFrontend(
    @Param('id') id: string,
    @Body() dto: PaidPatientUpdateDto,
  ): Promise<PaidPatientUpdateDto> {
    return this.paidPatientService.updateRecordForFrontend(id, dto);
  }
}
