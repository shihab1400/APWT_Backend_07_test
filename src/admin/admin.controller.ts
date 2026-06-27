import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Post,
  ParseIntPipe,
  Put,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDTO } from './admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getAllAdmin(): AdminDTO[] {
    return this.adminService.getAllAdmin();
  }

  @Get('getadminbyid/:id')
  getAdminById(@Param('id', ParseIntPipe) id: number): AdminDTO {
    return this.adminService.getAdminById(id);
  }

  @Get('getadminbyquery')
  getAdminByQuery(
    @Query('name') name: string,
    @Query('email') email: string,
  ): AdminDTO[] {
    return this.adminService.getAdminByQuery(name, email);
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
  ): AdminDTO {
    adminData.profilePic = myfile.filename;
    return this.adminService.postAdminByBody(adminData);
  }

  @Put('updateadmin/:id')
  updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminData: AdminDTO,
  ): AdminDTO {
    return this.adminService.updateAdmin(id, adminData);
  }
}
