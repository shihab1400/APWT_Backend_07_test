import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { metricSummaryEntity } from './metricSummary.entity';
import { CreateMetricSummaryDto } from './metricSummary.dto';

@Injectable()
export class metricSummaryService {
  constructor(
    @InjectRepository(metricSummaryEntity)
    private readonly metricSummaryRepository: Repository<metricSummaryEntity>,
  ) {}

  async createMetricSummary(
    dto: CreateMetricSummaryDto,
  ): Promise<CreateMetricSummaryDto> {
    const metricSummary = this.metricSummaryRepository.create({
      title: dto.title,
      value: dto.value,
      change: dto.change,
      badge: dto.badge,
    });

    return this.metricSummaryRepository.save(metricSummary);
  }

  async getAllmetricSummary() {
    return this.metricSummaryRepository.find();
  }
}
