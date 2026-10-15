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
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDTO } from './admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { AdminAuthGuard } from './adminAuth/adminAuth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AdminAuthGuard)
  @Get()
  getAllAdmin(): object {
    return this.adminService.getAllAdmin();
  }

  @Get('getadminbyid/:id')
  getAdminById(@Param('id') id: string): object {
    return this.adminService.getAdminById(id);
  }

  @Get('getadminfullnamebyemail/:email')
  getAdminFullnameByEmail(
    @Param('email') email: string,
  ): Promise<string | null> {
    return this.adminService.getAdminFullnameByEmail(email);
  }

  @Get('getadminidbyemail/:email')
  getAdminIdByEmail(@Param('email') email: string): Promise<string | null> {
    return this.adminService.getAdminIdByEmail(email);
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

  //   @Get('getadminwithspecificcolumn')
  //   getadminwithspecificcolumn(): object {
  //     return this.adminService.getAdminWithSpecificColumn();
  //   }

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
  @Post('addadmin')
  @UsePipes(new ValidationPipe())
  addAdmin(
    @Body() adminData: AdminDTO,
    @UploadedFile() myfile: Express.Multer.File,
  ): object {
    adminData.profilePic = myfile.filename;
    return this.adminService.addAdmin(adminData);
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
