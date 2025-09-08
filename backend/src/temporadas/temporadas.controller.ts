import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TemporadasService } from './temporadas.service';
import { CreateTemporadaDto } from './dto/create-temporada.dto';
import { UpdateTemporadaDto } from './dto/update-temporada.dto';

@Controller('temporadas')
export class TemporadasController {
  constructor(private readonly temporadasService: TemporadasService) {}

  // @Post()
  // create(@Body() createTemporadaDto: CreateTemporadaDto) {
  //   return this.temporadasService.create(createTemporadaDto);
  // }

  @Get()
  findAll() {
    return this.temporadasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.temporadasService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTemporadaDto: UpdateTemporadaDto,
  // ) {
  //   return this.temporadasService.update(+id, updateTemporadaDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.temporadasService.remove(+id);
  }
}
