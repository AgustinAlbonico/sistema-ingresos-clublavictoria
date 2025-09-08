import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Socio } from 'src/socios/entities/socio.entity';

@Entity('REGISTRO_INGRESO')
export class RegistroIngreso {
  @PrimaryGeneratedColumn({ name: 'id_ingreso' })
  id: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  @Index()
  fecha: Date;

  @Column({ type: 'time', default: () => 'CURRENT_TIME' })
  hora_ingreso: string;

  @Column({ type: 'enum', enum: ['SOCIO_CLUB', 'SOCIO_PILETA', 'NO_SOCIO'] })
  @Index()
  tipo_ingreso: string;

  @Column({ nullable: true })
  id_socio: number;

  @ManyToOne(() => Socio, (socio) => socio.ingresos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_socio' })
  socio: Socio;
}
