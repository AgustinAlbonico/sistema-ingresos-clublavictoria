import { Injectable } from '@nestjs/common';
import { TemporadaPiletaRepository } from './repositories/temporada.repository';
import { CreateTemporadaDto } from './dto/create-temporada.dto';

@Injectable()
export class TemporadasService {
  constructor(private readonly temporadaRepository: TemporadaPiletaRepository) {}
  create(createTemporadaDto: CreateTemporadaDto) {
    return this.temporadaRepository.save(createTemporadaDto);
  }

  findAll() {
    return this.temporadaRepository.find({order: {fechaInicio: 'DESC'}});
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
}
