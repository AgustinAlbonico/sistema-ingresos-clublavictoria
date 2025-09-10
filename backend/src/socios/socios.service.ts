import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SocioRepository } from './repositories/socio.repository';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateSocioDto } from './dto/create-socio.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CustomError } from 'src/constants/errors/custom-error';

@Injectable()
export class SociosService {
  constructor(
    private readonly socioRepository: SocioRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createSocioDto: CreateSocioDto, file?: Express.Multer.File) {
    let fotoUrl: string | undefined;

    if (createSocioDto.dni) {
      const foundUser = await this.socioRepository.findByDni(
        createSocioDto.dni,
      );
      if (foundUser) {
        throw new CustomError('El DNI ya se encuentra registrado');
      }
    }

    const fechaAlta = new Date().toLocaleDateString('sv-SE', {
      timeZone: 'America/Argentina/Buenos_Aires',
    });

    if (file) {
      try {
        const uploadFile = await this.cloudinaryService.uploadFile(file);
        fotoUrl = uploadFile.secure_url;
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Error al subir la foto del socio ');
      }
    }

    const socioData = {
      ...createSocioDto,
      fechaAlta,
      fotoUrl,
    };

    try {
      const socio = await this.socioRepository.createSocio(socioData);
      return socio;
    } catch (error) {
      console.log(error);
      throw new CustomError('Error guardando el socio');
    }
  }

  async update(id: number, updateSocioDto: CreateSocioDto, file?: Express.Multer.File) {
    try {
        // 1. First check if socio exists
        const existingSocio = await this.socioRepository.findOne({ where: { id } });
        if (!existingSocio) {
            throw new CustomError('Socio no encontrado', 404);
        }

        // 2. Handle file upload if exists
        let fotoUrl = existingSocio.fotoUrl;

        if (file) {
            try {
                const uploadFile = await this.cloudinaryService.uploadFile(file);
                fotoUrl = uploadFile.secure_url;
                // Delete old photo if it exists
                if (existingSocio.fotoUrl) {
                    await this.cloudinaryService.deleteFile(existingSocio.fotoUrl);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                throw new CustomError('Error al subir la foto del socio');
            }
        }

        // 3. Update the socio
        return await this.socioRepository.updateSocio(existingSocio, {
            ...updateSocioDto,
            ...(fotoUrl && { fotoUrl })
        });

    } catch (error) {
        console.error('Error updating socio:', error);
        throw error instanceof CustomError ? error : new CustomError('Error al actualizar el socio');
    }
}

  async findAll(paginationDto: PaginationDto) {
    try {
      return await this.socioRepository.findPaginatedAndFiltered(
        paginationDto.page,
        paginationDto.limit,
        paginationDto.search,
      );
    } catch (error) {
      throw new BadRequestException('Error fetching socios: ' + error.message);
    }
  }

  async findOne(id: number) {
    try {
      const socio = await this.socioRepository.findOne({ where: { id } });
      if (!socio) {
        throw new CustomError(`Socio no encontrado`, 404);
      }
      return socio;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new CustomError('Error en el servidor', 500);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.socioRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Socio with ID ${id} not found`);
      }
      return { message: 'Socio deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error deleting socio: ' + error.message);
    }
  }
}
