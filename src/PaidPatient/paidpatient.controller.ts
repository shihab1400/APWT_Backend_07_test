import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { PaidPatientService } from './paidpatient.service';

@Controller('paid-patient')
export class PaidPatientController {
  constructor(private readonly paidPatientService: PaidPatientService) {}

 
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

  
  @Post('create-record')
  createRecord(@Body() data: any): object {
    return this.paidPatientService.createRecord(data);
  }
}