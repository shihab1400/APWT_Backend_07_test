import {
  Body,
  Controller,
  Post,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './doctorAuth.service';
import { DoctorDTO, loginDTO, VerifyOtpDto } from '../doctor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { DoctorEntity } from '../doctor.entity';

@Controller('doctor/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
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
  async addUser(
    @Body() myobj: DoctorDTO,
    @UploadedFile() myfile: Express.Multer.File,
  ): Promise<DoctorEntity> {
    if (!myfile) {
      throw new BadRequestException('Profile picture is required');
    }

    myobj.profilePic = myfile.filename;

    return this.authService.signUp(myobj);
  }

  @Post('verify-otp')
  @UsePipes(new ValidationPipe())
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('login')
  signIn(@Body() logindata: loginDTO) {
    return this.authService.signIn(logindata);
  }
}
