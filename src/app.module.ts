import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { join } from 'path';
import { HttpExceptionFilter } from './http-exception.filter';
import { APP_FILTER } from '@nestjs/core';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, envFilePath: [
        '.local.env'
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
        connectTimeoutMS: 10000, // Increase timeout
        retryAttempts: 5, // Increase retry attempts
        retryDelay: 3000, // Increase delay between retries
        entities: [join(__dirname, '**', '*.entity.{js,ts}')]
      }),


    }),
    UserModule,
    TodoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class RootModule {
  constructor() {
    console.log('root module execute')
  }
}
