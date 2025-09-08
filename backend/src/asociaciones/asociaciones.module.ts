import { Module } from '@nestjs/common';
import { AsociacionesController } from './asociaciones.controller';
import { AsociacionesService } from './asociaciones.service';

@Module({
  controllers: [AsociacionesController],
  providers: [AsociacionesService],
})
export class AsociacionesModule {}
