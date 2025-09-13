import { Socio } from 'src/socios/entities/socio.entity';
import { TemporadaPileta } from 'src/temporadas/entities/temporada.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SOCIO_TEMPORADA')
export class SocioTemporada {
  @PrimaryGeneratedColumn({ name: 'id_socio_temporada' })
  id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', name: "fecha_hora_inscripcion" })
  fechaHoraInscripcion: string;

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
