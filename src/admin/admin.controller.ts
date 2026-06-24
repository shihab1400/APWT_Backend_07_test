import { Body, Controller, Get, Param, Query, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDTO } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getAllAdmin(): object {
    return this.adminService.getAllAdmin();
  }

  @Get('getadminbyid/:id')
  getAdminById(@Param('id') id: number): object {
    return this.adminService.getAdminById(id);
  }

  @Get('getadminbyquery')
  getAdminByQuery(
    @Query('id') id: number,
    @Query('name') name: string,
  ): object {
    return this.adminService.getAdminByQuery(id, name);
  }

  @Post('postadmin')
  postAdminByBody(@Body() adminData: AdminDTO): AdminDTO {
    console.log(adminData.name);
    return this.adminService.postAdminByBody(adminData);
  }
}
