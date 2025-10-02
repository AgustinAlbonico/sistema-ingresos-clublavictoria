import { Controller } from '@nestjs/common';
import { RegistroIngresoService } from './registro-ingreso.service';

@Controller('registro-ingreso')
export class RegistroIngresoController {
  constructor(
    private readonly registroIngresoService: RegistroIngresoService,
  ) {}
}
