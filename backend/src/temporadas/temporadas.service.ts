import { Injectable } from '@nestjs/common';
// import { CreateTemporadaDto } from './dto/create-temporada.dto';
// import { UpdateTemporadaDto } from './dto/update-temporada.dto';

@Injectable()
export class TemporadasService {
  // create(createTemporadaDto: CreateTemporadaDto) {
  //   return 'This action adds a new temporada';
  // }

  findAll() {
    return `This action returns all temporadas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} temporada`;
  }

  // update(id: number, updateTemporadaDto: UpdateTemporadaDto) {
  //   return `This action updates a #${id} temporada`;
  // }

  remove(id: number) {
    return `This action removes a #${id} temporada`;
  }
}
