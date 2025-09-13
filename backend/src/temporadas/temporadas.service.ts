import { Injectable } from '@nestjs/common';
import { TemporadaPiletaRepository } from './repositories/temporada.repository';
import { CreateTemporadaDto } from './dto/create-temporada.dto';
import { SocioRepository } from 'src/socios/repositories/socio.repository';
import { AsociacionesRepository } from 'src/asociaciones/repositories/asociaciones.repository';

@Injectable()
export class TemporadasService {
  constructor(
    private readonly temporadaRepository: TemporadaPiletaRepository,
    private readonly socioRepository: SocioRepository,
    private readonly asociacionesRepository: AsociacionesRepository,
  ) {}
  create(createTemporadaDto: CreateTemporadaDto) {
    return this.temporadaRepository.save(createTemporadaDto);
  }

  findAll() {
    return this.temporadaRepository.find({ order: { fechaInicio: 'DESC' } });
  }

  findOne(id: number) {
    return `This action returns a #${id} temporada`;
  }

  update(id: number, updateTemporadaDto: CreateTemporadaDto) {
    return this.temporadaRepository.update(id, updateTemporadaDto);
  }

  remove(id: number) {
    return this.temporadaRepository.delete(id);
  }

  async getSocios(id: number) {
    const asociaciones = await this.asociacionesRepository.find({
      where: { temporada: { id } },
      relations: { socio: true },
    });
    const socios = asociaciones.map((asociacion) => asociacion.socio);
    return socios;
  }

  async agregarSocioATemporada(id: number, socioId: number) {
    const nuevaAsociacion = this.asociacionesRepository.create({
      socio: { id: socioId },
      temporada: { id: id }
    });
    
    return this.asociacionesRepository.save(nuevaAsociacion);
  }
}
