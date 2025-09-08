import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IJwtPayload } from 'src/auth/entities/jwt-payload.interface';
import { AppConfigService } from 'src/config/AppConfig/app-config.service';
import { UsuarioRepository } from 'src/auth/repositories/usuario.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly userRepository: UsuarioRepository,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.getJwtSecret(),
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.userRepository.findByUsername(payload.usuario);

    if (!user) {
      throw new Error('Token no valido');
    }

    return user;
  }
}
