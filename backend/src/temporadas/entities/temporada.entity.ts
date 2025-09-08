import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { SocioTemporada } from 'src/asociaciones/entities/socio-temporada.entity';

@Entity('TEMPORADA_PILETA')
export class TemporadaPileta {
  @PrimaryGeneratedColumn({ name: 'id_temporada' })
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'date' })
  @Index()
  fecha_inicio: Date;

  @Column({ type: 'date' })
  @Index()
  fecha_fin: Date;

  @Column({ length: 100, nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => SocioTemporada, (st) => st.temporada)
  socios: SocioTemporada[];
}
