import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { SociosService } from './socios.service';
import { CreateSocioDto } from './dto/create-socio.dto';
import { Private } from '../common/decorators/private.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSocioDto } from './dto/update-socio.dto';

@Controller('socios')
export class SociosController {
  constructor(private readonly sociosService: SociosService) {}

  @Get()
  @Private()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.sociosService.findAll(paginationDto);
  }

  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  @Private()
  create(
    @Body() createSocioDto: CreateSocioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.sociosService.create(createSocioDto, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('foto'))
  @Private()
  update(
    @Param('id') id: number,
    @Body() updateSocioDto: UpdateSocioDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.sociosService.update(id, updateSocioDto, file);
  }

  @Get(':id')
  @Private()
  findOne(@Param('id') id: number) {
    return this.sociosService.findOne(id);
  }

  @Delete(':id')
  @Private()
  remove(@Param('id') id: number) {
    return this.sociosService.remove(id);
  }

  // @Get('disponibles-para-temporada/:temporadaId')
  // @Private()
  // getSociosDisponibles(@Param('temporadaId') temporadaId: number) {
  //   return this.sociosService.getSociosDisponibles(temporadaId);
  // }
}
