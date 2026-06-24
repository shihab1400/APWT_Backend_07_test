import { Injectable } from '@nestjs/common';
import { AdminDTO } from './admin.dto';

@Injectable()
export class AdminService {
  getAllAdmin(): object {
    return {
      name: 'ShihabAllAdmin',
      id: 52028,
    };
  }

  getAdminById(id: number): object {
    return {
      name: 'ShihabById',
      age: 12,
      id: id,
    };
  }

  getAdminByQuery(id: number, name: string): object {
    return {
      name: `${name}ByQuery`,
      id: id,
    };
  }

  postAdminByBody(data: AdminDTO): AdminDTO {
    return data;
  }
}
