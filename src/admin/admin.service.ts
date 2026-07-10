import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminDTO } from './admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  async getAllAdmin(): Promise<AdminEntity[]> {
    return await this.adminRepository.find();
  }

  async getAdminById(id: number): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({
      where: { adminId: id },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found!`);
    }
    return admin;
  }

  async getAdminByQuery(name: string, email: string): Promise<AdminEntity[]> {
    return await this.adminRepository.find({
      where: {
        name: Like(`%${name}%`),
        email: Like(`%${email}%`),
      },
    });
  }

  async postAdminByBody(data: AdminDTO): Promise<AdminEntity> {
    return await this.adminRepository.save(data);
  }

  async updateAdmin(id: number, adminObj: AdminDTO): Promise<AdminEntity> {
    const findAdmin = await this.adminRepository.findOne({
      where: { adminId: id },
    });
    if (!findAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found!`);
    }
    await this.adminRepository.update(id, adminObj);
    const updatedAdmin = await this.adminRepository.findOne({
      where: { adminId: id },
    });
    return updatedAdmin!;
  }
}
