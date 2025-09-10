import { Module } from '@nestjs/common';
import { SociosService } from './socios.service';
import { SociosController } from './socios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Socio } from './entities/socio.entity';
import { SocioRepository } from './repositories/socio.repository';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Socio])],
  controllers: [SociosController],
  providers: [SociosService, SocioRepository, CloudinaryService],
})
export class SociosModule {}
