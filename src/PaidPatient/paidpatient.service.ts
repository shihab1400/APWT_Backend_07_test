import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PaidPatientDto,
  PaidPatientUpdateDto,
  UpdatePasswordDto,
} from './paidpatient.dto';
import { PaidPatientEntity } from './paidpatient.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/admin.entity';
import { DoctorEntity } from 'src/Doctor/doctor.entity';

@Injectable()
export class PaidPatientService {
  constructor(
    @InjectRepository(PaidPatientEntity)
    private readonly paidPatientRepository: Repository<PaidPatientEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
  ) {}

  async getAllPatients(): Promise<PaidPatientEntity[]> {
    return await this.paidPatientRepository.find();
  }
  getChatHistory(): object {
    return {
      message: 'Chat history fetched successfully',
      data: [],
    };
  }

  getAssessmentQuiz(): object {
    return {
      message: 'Assessment quiz fetched successfully',
      data: [],
    };
  }

  getAppointmentDetails(id: number): object {
    const data = [
      { id: 1, name: 'Nipa', age: 60 },
      { id: 2, name: 'Akter', age: 60 },
      { id: 3, name: 'Nilima', age: 60 },
    ];

    const result = data.find((d) => d.id === id);

    if (!result) {
      throw new NotFoundException(`Appointment not found`);
    }

    return result;
  }

  getPaymentRecords(userId: number, type: string): object {
    const payments = [
      { userid: 1, name: 'Nipa', type: 'monthly', amount: 100 },
      { userid: 2, name: 'Neela', type: 'yearly', amount: 10000 },
      { userid: 3, name: 'Sadia', type: 'monthly', amount: 5000 },
    ];

    const result = payments.filter(
      (p) => p.userid === userId && p.type === type,
    );

    if (result.length === 0) {
      throw new NotFoundException('No payment records found');
    }

    return result;
  }
  async getPatientByFullName(fullName: string): Promise<PaidPatientEntity[]> {
    return await this.paidPatientRepository.find({
      where: { fullName: Like(`%${fullName}%`) },
    });
  }
  async getPatientByUsernameWithoutSpecific(username: string): Promise<object> {
    const patient = await this.paidPatientRepository.findOne({
      where: { username: Like(`%${username}%`) },

      select: {
        patientId: true,
        username: true,
        fullName: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }
  async getPatientByUsername(username: string): Promise<PaidPatientEntity> {
    const patient = await this.paidPatientRepository.findOne({
      where: { username: username },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }
  async getAdminInfoByPatientId(id: string): Promise<AdminEntity> {
    const patient = await this.paidPatientRepository.findOne({
      where: { patientId: id },
      relations: {
        admin: true,
        doctor: true,
      },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient.admin;
  }

  async getPatientByUsernameWithoutPassword(username: string): Promise<object> {
    const patient = await this.paidPatientRepository.findOne({
      where: { username: username },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...patientWithoutPassword } = patient;
    return patientWithoutPassword;
  }

  async deleteRecord(username: string): Promise<object> {
    const patient = await this.paidPatientRepository.findOne({
      where: { username: username },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    await this.paidPatientRepository.remove(patient);
    return { message: 'Patient record deleted successfully' };
  }

  // async createRecord(dto: PaidPatientDto): Promise<PaidPatientEntity> {
  //const { adminId, ...patientData } = dto;
  // const paidpatient = this.paidPatientRepository.create({
  //...patientData,
  //admin: adminId ? { adminId: adminId } : undefined,
  //});
  //return await this.paidPatientRepository.save(paidpatient);
  //}

  async updateRecord(id: string, dto: PaidPatientDto): Promise<object> {
    const index = await this.paidPatientRepository.findOneBy({ patientId: id });

    if (!index) {
      throw new NotFoundException('Patient not found');
    }

    await this.paidPatientRepository.update({ patientId: id }, dto);

    return {
      message: 'Patient record updated successfully',
    };
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<object> {
    const index = await this.paidPatientRepository.findOneBy({ patientId: id });

    if (!index) {
      throw new NotFoundException('Patient not found');
    }

    await this.paidPatientRepository.update(
      { patientId: id },
      { password: dto.password },
    );

    return {
      message: 'Patient Password updated successfully',
    };
  }

  async updateStatus(id: string): Promise<{ message: string }> {
    const findPatient = await this.paidPatientRepository.findOne({
      where: { patientId: id },
    });
    if (!findPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found!`);
    }
    await this.paidPatientRepository.update(id, { isActive: true, otp: null });

    return { message: 'Account successfully validated! You can now log in.' };
  }

  //   async addPaidPatient(myobj: PaidPatientDto): Promise<PaidPatientEntity> {
  //     const patient = this.paidPatientRepository.create(myobj); // Converted to entity class instance
  //     return await this.paidPatientRepository.save(patient);
  //   }
  async addPaidPatient(myobj: PaidPatientDto): Promise<PaidPatientEntity> {
    const admin = await this.adminRepository.findOne({
      where: {
        adminId: myobj.adminId,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // 1. Only look up doctor if doctorId is provided
    let doctor: DoctorEntity | null = null;
    if (myobj.doctorId) {
      doctor = await this.doctorRepository.findOne({
        where: {
          doctorId: myobj.doctorId,
        },
      });

      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }
    }

    // 2. Create the patient entity
    const patient = this.paidPatientRepository.create(myobj);

    patient.admin = admin;
    patient.doctor = doctor; // Sets to null if no doctorId was passed

    return await this.paidPatientRepository.save(patient);
  }

  async findOne(email: string): Promise<PaidPatientEntity> {
    const patient = await this.paidPatientRepository.findOne({
      where: { email },
    });
    if (!patient) {
      throw new NotFoundException(`Patient with Email ${email} not found!`);
    }
    return patient;
  }

  async allpatientsforfrontend(): Promise<object[]> {
    return await this.paidPatientRepository.find({
      select: {
        patientId: true,
        username: true,
        fullName: true,
        phone: true,
        email: true,
        isActive: true,
        otp: true,
      },
    });
  }

  async deletePatientForFrontend(id: string): Promise<object> {
    const patient = await this.paidPatientRepository.findOne({
      where: { patientId: id },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    await this.paidPatientRepository.remove(patient);
    return { message: 'Patient record deleted successfully' };
  }

  async updateRecordForFrontend(
    id: string,
    dto: PaidPatientUpdateDto,
  ): Promise<PaidPatientUpdateDto> {
    const index = await this.paidPatientRepository.findOneBy({ patientId: id });

    if (!index) {
      throw new NotFoundException('Patient not found');
    }

    await this.paidPatientRepository.update({ patientId: id }, dto);

    return dto;
  }
}
