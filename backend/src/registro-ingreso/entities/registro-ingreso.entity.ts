import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Socio } from 'src/socios/entities/socio.entity';

@Entity('registro_ingreso')
export class RegistroIngreso {
  @PrimaryGeneratedColumn({ name: 'id_ingreso' })
  id: number;

  @Column({ nullable: true, name: 'id_socio' })
  id_socio: number;

  @Column({ type: 'varchar', length: 20, name: 'dni', nullable: true })
  @Index()
  dni: string;

  @Column({ type: 'enum', enum: ['SOCIO_CLUB', 'SOCIO_PILETA', 'NO_SOCIO'] })
  @Index()
  tipo_ingreso: 'SOCIO_CLUB' | 'SOCIO_PILETA' | 'NO_SOCIO';

  @Column({ type: 'boolean', name: 'habilita_pileta' })
  habilita_pileta: boolean;

  @Column({ type: 'enum', enum: ['EFECTIVO', 'TRANSFERENCIA'], nullable: true })
  metodo_pago: 'EFECTIVO' | 'TRANSFERENCIA';

  @Column({ type: 'int', name: 'importe', nullable: true })
  importe: number;

  @Column({
    type: 'timestamp',
    default: () => 'now()',
    name: 'fecha_hora_ingreso',
  })
  @Index()
  fecha_hora_ingreso: Date;

  @ManyToOne(() => Socio, (socio) => socio.ingresos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_socio' })
  socio: Socio;
}
