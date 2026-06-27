import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminDTO } from './admin.dto';

@Injectable()
export class AdminService {
  adminData: AdminDTO[] = [
    {
      id: 1,
      name: 'Shihab',
      email: 'shihab@gmail.xyz',
      nid: '2312345678',
      profilePic: '12334sdwe',
    },
    {
      id: 2,
      name: 'Farhat',
      email: 'farhat@gmail.xyz',
      nid: '1234125623',
      profilePic: '23sfdwqed',
    },
  ];

  getAllAdmin(): AdminDTO[] {
    return this.adminData;
  }

  getAdminById(id: number): AdminDTO {
    const admin = this.adminData.find((i) => i.id === id);
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  getAdminByQuery(name: string, email: string): AdminDTO[] {
    const filteredAdmins = this.adminData.filter(
      (n) =>
        n.name?.toLowerCase() === name.toLowerCase() &&
        n.email?.toLowerCase() === email.toLowerCase(),
    );

    if (filteredAdmins.length === 0) {
      throw new NotFoundException(
        `Admin with name "${name}" and email "${email}" not found`,
      );
    }

    return filteredAdmins;
  }

  postAdminByBody(data: AdminDTO): AdminDTO {
    const ex = this.adminData.find((i) => i.id === data.id);
    if (ex) {
      throw new NotFoundException(`Admin with ID "${data.id}" already exists`);
    }
    this.adminData.push(data);
    return data;
  }

  updateAdmin(id: number, adminObj: AdminDTO): AdminDTO {
    const adminIndex = this.adminData.findIndex((admin) => admin.id === id);
    if (adminIndex === -1) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    this.adminData[adminIndex] = adminObj;
    return adminObj;
  }
}
