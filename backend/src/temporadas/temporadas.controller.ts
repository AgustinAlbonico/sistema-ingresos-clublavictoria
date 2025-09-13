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
  @Private()
  findOne(@Param('id') id: string) {
    return this.temporadasService.findOne(+id);
  }

  @Patch(':id')
  @Private()
  update(
    @Param('id') id: number,
    @Body() updateTemporadaDto: CreateTemporadaDto,
  ) {
    return this.temporadasService.update(id, updateTemporadaDto);
  }

  @Delete(':id')
  @Private()
  remove(@Param('id') id: number) {
    return this.temporadasService.remove(id);
  }

  @Get(':id/socios')
  @Private()
  getSocios(@Param('id') id: number) {
    return this.temporadasService.getSocios(id);
  }

  @Post(':id/socios')
  @Private()
  agregarSocioATemporada(@Param('id') id: number, @Body() body: { socioId: number }) {
    return this.temporadasService.agregarSocioATemporada(id, body.socioId);
  }
}
