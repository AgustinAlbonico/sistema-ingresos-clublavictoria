import { Injectable } from '@nestjs/common';
import { TemporadaPiletaRepository } from './repositories/temporada.repository';
import { CreateTemporadaDto } from './dto/create-temporada.dto';
import { SocioRepository } from 'src/socios/repositories/socio.repository';
import { AsociacionesRepository } from 'src/asociaciones/repositories/asociaciones.repository';
import { CustomError } from 'src/constants/errors/custom-error';

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
    const socios = asociaciones.map((asociacion) => {
      return {
        id: asociacion.socio.id,
        socio: asociacion.socio
      };
    });
    return socios;
  }

  async agregarSocioATemporada(id: number, socioId: number) {
    const nuevaAsociacion = this.asociacionesRepository.create({
      socio: { id: socioId },
      temporada: { id: id }
    });
    
    return this.asociacionesRepository.save(nuevaAsociacion);
  }

  async eliminarSocioDeTemporada(id: number, socioId: number) {
    const asociacion = await this.asociacionesRepository.findOne({
      where: { temporada: { id }, socio: { id: socioId } },
    });
    
    if (!asociacion) {
      throw new CustomError('Asociacion no encontrada', 404);
    }

    return this.asociacionesRepository.remove(asociacion);
  }

  async getSociosDisponibles(temporadaId: number, page: number = 1, limit: number = 10, search?: string) {
    // Get all members already in this season
    const asociaciones = await this.asociacionesRepository.find({
      where: { temporada: { id: temporadaId } },
      relations: { socio: true },
    });
    
    const sociosEnTemporada = asociaciones.map(asociacion => asociacion.socio.id);
    
    // Build query for available members (not in current season)
    const queryBuilder = this.socioRepository.createQueryBuilder('socio');
    
    // Exclude members already in the season
    if (sociosEnTemporada.length > 0) {
      queryBuilder.andWhere('socio.id NOT IN (:...sociosEnTemporada)', { sociosEnTemporada });
    }
    
    // Add search filter if provided
    if (search && search.trim()) {
      queryBuilder.andWhere(
        '(LOWER(socio.nombre) LIKE LOWER(:search) OR LOWER(socio.apellido) LIKE LOWER(:search) OR socio.dni LIKE :search OR LOWER(socio.email) LIKE LOWER(:search))',
        { search: `%${search.trim()}%` }
      );
    }
    
    // Add pagination
    const offset = (page - 1) * limit;
    queryBuilder
      .orderBy('socio.apellido', 'ASC')
      .addOrderBy('socio.nombre', 'ASC')
      .skip(offset)
      .take(limit);
    
    const [socios, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: socios,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
