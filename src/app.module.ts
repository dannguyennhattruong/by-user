import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './commons/all-exceptions.filter';
import { HttpModule } from '@nestjs/axios';
import configs from "./configurations/environment.config";
import { AppConfigurationModule } from './configurations/config.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule, } from "nest-winston";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as winston from "winston";
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from "@nestjs/mongoose";
import { ENVIRONMENT } from './commons/enums';
import { ByAccountModule } from './controllers/by-account/by-account.module';
const pino = require('pino')
const env = configs();
export const transportOptions =
  env[ENVIRONMENT.NODE_ENV] !== "production"
    ? {
      transport: { target: "pino-pretty" },
    }
    : {};

@Module({
  imports: [
    AppConfigurationModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike("API", {
              prettyPrint: true,
            })
          ),
        }),
        // other transports...
      ],
      // other options
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<any> => ({
        pinoHttp: {
          logger: pino(),
          name: "add some name to every JSON line",
          serializers: {
            err: pino.stdSerializers.err,
            req: pino.stdSerializers.req,
            res: pino.stdSerializers.res
          },
          level:
            configService.get<string>(ENVIRONMENT.NODE_ENV) !== "production"
              ? "debug"
              : "error",
          // install 'pino-pretty' package in order to use the following option
          ...transportOptions,
          useLevelLabels: true,
          customLogLevel: function (res, err) {
            if (res.statusCode >= 400 && res.statusCode < 500) {
              return 'warn'
            } else if (res.statusCode >= 500 || err) {
              return 'error'
            } else if (res.statusCode >= 300 && res.statusCode < 400) {
              return 'silent'
            }
            return 'info'
          },
          // Define a custom success message
          customSuccessMessage: function (res) {
            if (res.statusCode === 404) {
              return 'resource not found'
            }
            return 'request completed'
          },
          // Define a custom receive message
          customReceivedMessage: function (req, _res) {
            return 'request received: ' + req.method
          },
          // Override attribute keys for the log object
          customAttributeKeys: {
            req: 'request',
            res: 'response',
            err: 'error',
            responseTime: 'timeTaken'
          },
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: ENVIRONMENT.MONGODB_URI_BY_USER,
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(ENVIRONMENT.MONGODB_URI_BY_USER),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: ENVIRONMENT.MONGODB_URI_LOG,
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(ENVIRONMENT.MONGODB_URI_LOG),
      }),
      inject: [ConfigService],
    }),
    HttpModule.register({
      timeout: env[ENVIRONMENT.HTTP_TIMEOUT],
      maxRedirects: env[ENVIRONMENT.HTTP_MAX_REDIRECTS],
    }),
    ByAccountModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
}

