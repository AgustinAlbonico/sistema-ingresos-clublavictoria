import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

  // Metodo para obtener los socios de una temporada
  @Get(':id/socios')
  @Private()
  getSocios(@Param('id') id: number) {
    return this.temporadasService.getSocios(id);
  }

  // Metodo para agregar un socio a una temporada
  @Post(':id/socios')
  @Private()
  agregarSocioATemporada(@Param('id') id: number, @Body() body: { socioId: number }) {
    return this.temporadasService.agregarSocioATemporada(id, body.socioId);
  }

  // Metodo para eliminar un socio de una temporada
  @Delete(':id/socios/:socioId')
  @Private()
  eliminarSocioDeTemporada(@Param('id') id: number, @Param('socioId') socioId: number) {
    return this.temporadasService.eliminarSocioDeTemporada(id, socioId);
  }

  // Metodo para obtener socios disponibles (no registrados en la temporada)
  @Get(':id/socios-disponibles')
  @Private()
  getSociosDisponibles(
    @Param('id') id: number,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string
  ) {
    const res = this.temporadasService.getSociosDisponibles(
      id,
      parseInt(page),
      parseInt(limit),
      search
    );
    return res;
  }
}
