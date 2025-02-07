import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import dbConfig from './database/db.config';
import { UserModule } from 'src/app/user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from 'src/app/auth/auth.module';
import { MinioModule } from 'src/plugins/minio/minio.module';
import { minioConfig } from 'src/common/config/minio.config';
import { MediaModule } from 'src/app/media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
        user: configService.get<string>('db.user'),
        pass: configService.get<string>('db.pass'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
      serveRoot: '/docs',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'swagger'),
      serveRoot: '/swagger',
    }),
    UserModule,
    AuthModule,
    MinioModule.forRoot(minioConfig),
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
