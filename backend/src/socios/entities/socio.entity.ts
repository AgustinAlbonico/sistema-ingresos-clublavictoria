import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { SocioTemporada } from 'src/asociaciones/entities/socio-temporada.entity';
import { RegistroIngreso } from 'src/registro-ingreso/entities/registro-ingreso.entity';

@Entity('SOCIO')
export class Socio {
  @PrimaryGeneratedColumn({ name: 'id_socio' })
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  @Index()
  apellido: string;

  @Column({ length: 20, unique: true })
  @Index()
  dni: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_alta: Date;

  @Column({ type: 'date' })
  fecha_nacimiento: Date;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  @Index()
  estado: string;

  @Column({ type: 'enum', enum: ['MASCULINO', 'FEMENINO'], nullable: true })
  genero: string;

  @Column({ length: 500, nullable: true })
  foto_url: string;

  @OneToMany(() => SocioTemporada, (st) => st.socio)
  temporadas: SocioTemporada[];

  @OneToMany(() => RegistroIngreso, (ingreso) => ingreso.socio)
  ingresos: RegistroIngreso[];
}
