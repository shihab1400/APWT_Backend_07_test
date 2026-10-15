import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { metricSummaryEntity } from './metricSummary.entity';
import { MetricSummaryController } from './metricSummary.controller';
import { metricSummaryService } from './metricSummary.service';

@Module({
  imports: [TypeOrmModule.forFeature([metricSummaryEntity])],
  controllers: [MetricSummaryController],
  providers: [metricSummaryService],
  exports: [metricSummaryService],
})
export class MetricSummaryModule {}
