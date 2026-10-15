import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('metricSummary')
export class metricSummaryEntity {
  @PrimaryGeneratedColumn()
  metricSummary_id: number;

  @Column()
  title: string;

  @Column()
  value: string;

  @Column()
  change: string;

  @Column()
  badge: string;
}
