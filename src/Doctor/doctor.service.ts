import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorEntity } from './doctor.entity';
import { DoctorProfileEntity } from './doctor-profile.entity';
import { AppointmentEntity } from './appointment.entity';
import {
  DoctorDTO,
  CreateAppointmentDto,
  CreateDoctorProfileDto,
} from './doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private doctorRepo: Repository<DoctorEntity>,
    @InjectRepository(DoctorProfileEntity)
    private profileRepo: Repository<DoctorProfileEntity>,
    @InjectRepository(AppointmentEntity)
    private appointmentRepo: Repository<AppointmentEntity>,
  ) {}

  // ==================== AUTH HELPERS ====================

  async addDoctor(dto: DoctorDTO): Promise<DoctorEntity> {
    try {
      const doctor = this.doctorRepo.create(dto);
      return await this.doctorRepo.save(doctor);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        // PostgreSQL unique violation code
        throw new ConflictException('Email already exists in the system');
      }
      throw error;
    }
  }

  async findOne(email: string): Promise<DoctorEntity | null> {
    return await this.doctorRepo.findOne({ where: { email } });
  }

  async updateStatus(doctorId: number): Promise<{ message: string }> {
    await this.doctorRepo.update(doctorId, { isActive: true, otp: '' });
    return { message: 'Doctor account verified successfully' };
  }

  // ==================== GENERAL DOCTOR CRUD OPERATIONS ====================

  async findAll(): Promise<DoctorEntity[]> {
    return await this.doctorRepo.find({
      relations: {
        profile: true,
        appointments: true,
      },
    });
  }

  async findById(id: number): Promise<DoctorEntity> {
    const doctor = await this.doctorRepo.findOne({
      where: { doctorId: id },
      relations: {
        profile: true,
        appointments: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return doctor;
  }
  async updateDoctor(
    id: number,
    updateData: Partial<DoctorDTO>,
  ): Promise<DoctorEntity> {
    await this.doctorRepo.update(id, updateData);
    return this.findById(id);
  }

  async patchSpecialization(
    id: number,
    specialization: string,
  ): Promise<DoctorEntity> {
    await this.findById(id);
    await this.doctorRepo.update(id, { specialization });
    return this.findById(id);
  }

  async patchEmail(id: number, email: string): Promise<DoctorEntity> {
    await this.findById(id);
    try {
      await this.doctorRepo.update(id, { email });
      return await this.findById(id);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        // PostgreSQL unique violation code
        throw new ConflictException('Email already exists in the system');
      }
      throw error;
    }
  }

  async removeDoctor(id: number): Promise<{ message: string }> {
    const doctor = await this.findById(id);
    await this.doctorRepo.remove(doctor);
    return { message: `Doctor with ID ${id} deleted successfully` };
  }

  // ==================== RELATIONSHIP CRUD OPERATIONS ====================

  // 1. One-to-One: Create/Update Doctor Bio Profile
  async setDoctorProfile(
    doctorId: number,
    dto: CreateDoctorProfileDto,
  ): Promise<DoctorProfileEntity> {
    const doctor = await this.findById(doctorId);
    let profile = await this.profileRepo.findOne({
      where: { doctor: { doctorId } },
    });
    if (!profile) {
      profile = this.profileRepo.create({ ...dto, doctor });
    } else {
      Object.assign(profile, dto);
    }
    return await this.profileRepo.save(profile);
  }

  // 2. One-to-Many: Create Appointment for Doctor
  async createAppointment(
    doctorId: number,
    dto: CreateAppointmentDto,
  ): Promise<AppointmentEntity> {
    const doctor = await this.findById(doctorId);
    const appointment = this.appointmentRepo.create({ ...dto, doctor });
    return await this.appointmentRepo.save(appointment);
  }

  // 3. One-to-Many: Get Appointments for Doctor
  async getDoctorAppointments(doctorId: number): Promise<AppointmentEntity[]> {
    await this.findById(doctorId);
    return await this.appointmentRepo.find({ where: { doctor: { doctorId } } });
  }

  // 4. One-to-Many: Delete Appointment
  async deleteAppointment(appointmentId: number): Promise<{ message: string }> {
    const appointment = await this.appointmentRepo.findOne({
      where: { appointmentId },
    });
    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointmentId} not found`,
      );
    }
    await this.appointmentRepo.remove(appointment);
    return { message: `Appointment ${appointmentId} removed successfully` };
  }

  async getAllDoctorsForFrontend(): Promise<DoctorEntity[]> {
    return await this.doctorRepo.find({
      relations: {
        profile: true,
        appointments: true,
      },
    });
  }

  async updateDoctorForFrontend(
    id: number,
    updateData: Partial<DoctorDTO>,
  ): Promise<DoctorEntity> {
    await this.doctorRepo.update(id, updateData);
    return this.findById(id);
  }

  async deleteDoctorForFrontend(id: number): Promise<{ message: string }> {
    const doctor = await this.doctorRepo.findOne({
      where: { doctorId: id },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    await this.doctorRepo.remove(doctor);
    return { message: 'Patient record deleted successfully' };
  }
}
