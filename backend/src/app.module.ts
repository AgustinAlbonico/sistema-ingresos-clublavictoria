import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SociosModule } from './socios/socios.module';
import { TemporadasModule } from './temporadas/temporadas.module';
import { RegistroIngresoModule } from './registro-ingreso/registro-ingreso.module';
import { AsociacionesModule } from './asociaciones/asociaciones.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/AppConfig/app-config.service';
import { Socio } from './socios/entities/socio.entity';
import { TemporadaPileta } from './temporadas/entities/temporada.entity';
import { SocioTemporada } from './asociaciones/entities/socio-temporada.entity';
import { Usuario } from './auth/entities/usuario.entity';
import { RegistroIngreso } from './registro-ingreso/entities/registro-ingreso.entity';
import { AppConfigModule } from './config/AppConfig/app-config.module';

@Module({
  imports: [
    AuthModule,
    SociosModule,
    TemporadasModule,
    RegistroIngresoModule,
    AsociacionesModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        type: 'mysql',
        host: configService.getDatabaseHost(),
        username: configService.getDatabaseUser(),
        password: configService.getDatabasePassword(),
        port: configService.getDatabasePort(),
        database: configService.getDatabaseName(),
        timezone: configService.getDatabaseTimezone(),
        entities: [
          Socio,
          TemporadaPileta,
          SocioTemporada,
          Usuario,
          RegistroIngreso,
        ],
        synchronize: false,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
