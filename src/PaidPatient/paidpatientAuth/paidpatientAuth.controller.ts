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
import { AuthService } from './paidpatientAuth.service';
import {
  PaidPatientDto,
  loginDTO,
  VerifyOtpDto,
} from 'src/PaidPatient/paidpatient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { PaidPatientEntity } from '../paidpatient.entity';

@Controller('paidpatient/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('myfile', {
      fileFilter: (req, file, cb) => {
        // 1. Case-insensitive extension check AND mimetype check
        const isAllowedExt = /\.(jpg|jpeg|png|webp)$/i.test(file.originalname);
        const isAllowedMime = /^image\/(jpeg|png|webp)$/i.test(file.mimetype);

        if (isAllowedExt && isAllowedMime) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only .jpg, .jpeg, .png, and .webp images are allowed',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 2000000 },
      storage: diskStorage({
        destination: './upload',
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `${uniqueSuffix}.${ext}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async addUser(
    @Body() myobj: PaidPatientDto,
    @UploadedFile() myfile: Express.Multer.File,
  ): Promise<PaidPatientEntity> {
    if (!myfile) {
      throw new BadRequestException('Profile picture is required');
    }
    if (!myobj.password) {
      throw new BadRequestException('Password is required');
    }
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(myobj.password, salt);
    myobj.password = hashedpassword;
    myobj.file = myfile.filename;

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
