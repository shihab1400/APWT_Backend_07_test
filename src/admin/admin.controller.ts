import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDTO } from './admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getAllAdmin(): object {
    return this.adminService.getAllAdmin();
  }

  @Get('getadminbyid/:id')
  getAdminById(@Param('id') id: string): object {
    return this.adminService.getAdminById(id);
  }

  @Get('getadminwithnoname')
  getAdminWithNoName(): object {
    return this.adminService.getAdminWithNoName();
  }

  @Get('getadminbyquery')
  getAdminByQuery(
    @Query('fullname') fullname: string,
    @Query('email') email: string,
  ): object {
    return this.adminService.getAdminByQuery(fullname, email);
  }

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
  @Post('postadmin')
  @UsePipes(new ValidationPipe())
  postAdminByBody(
    @Body() adminData: AdminDTO,
    @UploadedFile() myfile: Express.Multer.File,
  ): object {
    adminData.profilePic = myfile.filename;
    return this.adminService.postAdminByBody(adminData);
  }

  @Put('updateadmin/:id')
  updateAdmin(@Param('id') id: string, @Body() adminData: AdminDTO): object {
    return this.adminService.updateAdmin(id, adminData);
  }

  @Delete('deleteadmin/:id')
  deleteAdmin(@Param('id') id: string): object {
    return this.adminService.deleteAdmin(id);
  }
}
