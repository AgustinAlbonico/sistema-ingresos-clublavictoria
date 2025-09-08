import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('USUARIO')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id: number;

  @Column({ unique: true, length: 100 })
  @Index()
  usuario: string;

  @Column({ length: 100 })
  password: string;
}
