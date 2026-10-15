import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminDTO } from './admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './admin.entity';
import { IsNull, Like, Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  async getAllAdmin(): Promise<AdminEntity[]> {
    return await this.adminRepository.find();
  }

  async getAdminFullnameByEmail(email: string): Promise<string | null> {
    const admin = await this.adminRepository.findOne({
      where: { email: email },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found!`);
    }
    return admin.fullname;
  }

  async getAdminIdByEmail(email: string): Promise<string | null> {
    const admin = await this.adminRepository.findOne({
      where: { email: email },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found!`);
    }
    return admin.adminId;
  }

  async getAdminById(id: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({
      where: { adminId: id },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found!`);
    }
    return admin;
  }

  //   async getAdminWithSpecificColumn(): Promise<AdminEntity[]> {
  //     const admins = await this.adminRepository.find({
  //       select: {
  //         fullname: true,
  //         nid: true,
  //       },
  //     });
  //     return admins;
  //   }

  async getAdminWithNoName(): Promise<AdminEntity[]> {
    const admin = await this.adminRepository.find({
      where: { fullname: IsNull() },
    });
    return admin;
  }

  async getAdminByQuery(
    fullname: string,
    email: string,
  ): Promise<AdminEntity[]> {
    return await this.adminRepository.find({
      where: {
        fullname: Like(`%${fullname}%`),
        email: Like(`%${email}%`),
      },
    });
  }

  async addAdmin(myobj: AdminDTO): Promise<AdminEntity> {
    const admin = this.adminRepository.create(myobj); // Converted to entity class instance
    return await this.adminRepository.save(admin);
  }

  async updateAdmin(id: string, adminObj: AdminDTO): Promise<AdminEntity> {
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

  async updateStatus(id: string): Promise<{ message: string }> {
    const findAdmin = await this.adminRepository.findOne({
      where: { adminId: id },
    });
    if (!findAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found!`);
    }
    await this.adminRepository.update(id, { isActive: true, otp: null });

    return { message: 'Account successfully validated! You can now log in.' };
  }

  async deleteAdmin(id: string): Promise<object> {
    const findAdmin = await this.adminRepository.findOne({
      where: { adminId: id },
    });
    if (!findAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found!`);
    }
    await this.adminRepository.delete(id);
    const deletedAdmin = {
      message: `Admin with id ${id} is deleted successfully!`,
    };
    return deletedAdmin;
  }

  async findOne(email: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({
      where: { email },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with Email ${email} not found!`);
    }
    return admin;
  }
}
