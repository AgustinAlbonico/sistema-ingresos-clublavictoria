import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsuarioRepository } from './repositories/usuario.repository';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './entities/jwt-payload.interface';
import { CustomError } from 'src/constants/errors/custom-error';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(input: LoginDto) {
    const userDb = await this.usuarioRepository.findByUsername(input.usuario);
    if (!userDb) {
      throw new CustomError('Usuario no encontrado', 404);
    }

    console.log(userDb);

    const isPasswordValid = await bcrypt.compare(
      input.password,
      userDb.password,
    );
    if (!isPasswordValid) {
      throw new CustomError('La contraseña ingresada es incorrecta', 401);
    }

    return userDb;
  }

  async login(user: LoginDto) {
    const usuario = await this.validateUser(user);

    const payload: IJwtPayload = {
      usuario: usuario.usuario,
    };

    const token = this.jwtService.signAsync(payload);

    return token;
  }

  async generarPasswordHash(password: string) {
    console.log(password);
    return await bcrypt.hash(password, 10);
  }
}
