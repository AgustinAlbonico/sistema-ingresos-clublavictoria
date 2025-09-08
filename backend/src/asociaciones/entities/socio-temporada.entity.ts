import { Socio } from 'src/socios/entities/socio.entity';
import { TemporadaPileta } from 'src/temporadas/entities/temporada.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('SOCIO_TEMPORADA')
export class SocioTemporada {
  @PrimaryColumn({ name: 'id_socio' })
  id_socio: number;

  @PrimaryColumn({ name: 'id_temporada' })
  id_temporada: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_inscripcion: Date;

  @ManyToOne(() => Socio, (socio) => socio.temporadas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_socio' })
  socio: Socio;

  @ManyToOne(() => TemporadaPileta, (temp) => temp.socios, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_temporada' })
  temporada: TemporadaPileta;
}
