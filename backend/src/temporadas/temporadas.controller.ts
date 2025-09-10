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
import { Private } from 'src/common/decorators/private.decorator';

@Controller('temporadas')
export class TemporadasController {
  constructor(private readonly temporadasService: TemporadasService) {}

  @Post()
  @Private()
  create(@Body() createTemporadaDto: CreateTemporadaDto) {
    return this.temporadasService.create(createTemporadaDto);
  }

  @Get()
  @Private()
  findAll() {
    return this.temporadasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.temporadasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateTemporadaDto: CreateTemporadaDto,
  ) {
    return this.temporadasService.update(id, updateTemporadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.temporadasService.remove(id);
  }
}
