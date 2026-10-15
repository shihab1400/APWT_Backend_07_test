import { Body, Controller, Get, Post } from '@nestjs/common';
import { metricSummaryService } from './metricSummary.service';
import { CreateMetricSummaryDto } from './metricSummary.dto';

@Controller('metricsummary')
export class MetricSummaryController {
  constructor(private readonly metricSummaryService: metricSummaryService) {}

  @Get()
  getAllmetricSummary(): object {
    return this.metricSummaryService.getAllmetricSummary();
  }

  @Post()
  createMetricSummary(@Body() dto: CreateMetricSummaryDto): object {
    return this.metricSummaryService.createMetricSummary(dto);
  }
}
