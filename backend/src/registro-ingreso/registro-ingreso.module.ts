import { Module } from '@nestjs/common';
import { RegistroIngresoService } from './registro-ingreso.service';

@Module({
  providers: [RegistroIngresoService],
})
export class RegistroIngresoModule {}
