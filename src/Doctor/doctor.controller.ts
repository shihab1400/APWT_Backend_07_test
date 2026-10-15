import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import {
  DoctorDTO,
  CreateAppointmentDto,
  CreateDoctorProfileDto,
  UpdateDoctorStatusDto,
  UpdateDoctorEmailDto,
} from './doctor.dto';
import { AuthGuard } from './auth/doctorAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  // 1. GET - Fetch all doctors (Protected)
  @UseGuards(AuthGuard)
  @Get()
  getAllDoctors() {
    return this.doctorService.findAll();
  }

  // 2. GET - Fetch doctor by ID (Public)
  @Get('getdoctorbyid/:id')
  getDoctorById(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.findById(id);
  }

  // 3. POST - Add doctor directly (Public, with file upload)
  @Post('adddoctor')
  @UseInterceptors(
    FileInterceptor('myfile', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 2000000 },
      storage: diskStorage({
        destination: './upload',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  addDoctor(
    @Body() doctorData: DoctorDTO,
    @UploadedFile() myfile: Express.Multer.File,
  ) {
    if (myfile) {
      doctorData.profilePic = myfile.filename;
    }
    return this.doctorService.addDoctor(doctorData);
  }

  // 4. PUT - Full update of doctor details (Public)
  @Put('updatedoctor/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateDoctor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<DoctorDTO>,
  ) {
    return this.doctorService.updateDoctor(id, updateData);
  }

  // 5. PATCH - Partial update of specialization (Public)
  @Patch('updatedoctor/:id/specialization')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  patchSpecialization(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDoctorStatusDto,
  ) {
    return this.doctorService.patchSpecialization(id, dto.specialization);
  }

  // 5.5 PATCH - Partial update of email (Public)
  @Patch('updatedoctor/:id/email')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  patchEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDoctorEmailDto,
  ) {
    return this.doctorService.patchEmail(id, dto.email);
  }

  // 6. DELETE - Remove doctor record (Public)
  @Delete('deletedoctor/:id')
  deleteDoctor(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.removeDoctor(id);
  }

  // ==================== RELATIONSHIP CRUD ROUTES ====================

  // 7. POST - One-to-One: Create/Update Doctor Profile (Protected)
  @UseGuards(AuthGuard)
  @Post('setprofile/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  setDoctorProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateDoctorProfileDto,
  ) {
    return this.doctorService.setDoctorProfile(id, dto);
  }

  // 8. POST - One-to-Many: Create Appointment for Doctor (Protected)
  @UseGuards(AuthGuard)
  @Post('addappointment/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  createAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.doctorService.createAppointment(id, dto);
  }

  // 9. GET - One-to-Many: Get Appointments for Doctor (Protected)
  @UseGuards(AuthGuard)
  @Get('getappointments/:id')
  getDoctorAppointments(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.getDoctorAppointments(id);
  }

  // 10. DELETE - One-to-Many: Delete Appointment (Protected)
  @UseGuards(AuthGuard)
  @Delete('deleteappointment/:appointmentId')
  deleteAppointment(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ) {
    return this.doctorService.deleteAppointment(appointmentId);
  }

  @Get('getalldoctorsforfrontend')
  getAllDoctorsForFrontend() {
    return this.doctorService.getAllDoctorsForFrontend();
  }

  @Put('updatedoctorforfrontend/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  updateDoctorForFrontend(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<DoctorDTO>,
  ) {
    return this.doctorService.updateDoctorForFrontend(id, updateData);
  }

  @Delete('deletedoctorforfrontend/:id')
  deleteDoctorForFrontend(@Param('id', ParseIntPipe) id: number) {
    return this.doctorService.deleteDoctorForFrontend(id);
  }
}
