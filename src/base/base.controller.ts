import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectPinoLogger } from 'nestjs-pino';
import { PinoLogger } from 'nestjs-pino/PinoLogger';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isArrayFull, isEqual, isObject } from './../commons/checks.util';
import { DEFAULT_SYSTEM } from './../commons/consts';
import { KEYS } from './../commons/enums';
import { ApiBearerAuth } from "@nestjs/swagger";
@ApiBearerAuth()
export class BaseController {
  @InjectPinoLogger(BaseController.name)
  protected readonly logger: PinoLogger;
  protected readonly apiByUserURI: string = '';
  protected readonly apiLogURI: string = '';
  protected readonly apiByesourceURI: string = '';
  protected readonly apiByConfigURI: string = '';

  private readonly headers = {
    'Content-Type': 'application/json',
  };

  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
  ) {
    this.apiByUserURI = this.configService.get<string>('API_BY_USER_URI');
    this.apiByesourceURI = this.configService.get<string>('API_BY_RESOURCE_URI');
    this.apiByConfigURI = this.configService.get<string>('API_BY_CONFIG_URI');
    this.apiLogURI = this.configService.get<string>('API_LOG_URI');
  }

  async post(
    apiURI: string,
    path: string,
    data: unknown = {},
    options: unknown = {},
  ): Promise<any> {
    options[`headers`] = { ...this.headers, ...options[`headers`] };
    return await lastValueFrom(
      this.httpService.post(`${apiURI}${path}`, data, options).pipe(
        map((res) => res.data),
        catchError(this.handleError()),
      ),
    );
  }

  async get(apiURI: string, path: string, options: unknown = {}): Promise<any> {
    options[`headers`] = this.headers;
    return await lastValueFrom(
      this.httpService.get(`${apiURI}${path}`, options).pipe(
        map((res) => res.data),
        catchError(this.handleError()),
      ),
    );
  }

  private handleError() {
    return (error: any) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // this.logger.error(error.response.data);
        // this.logger.error(error.response.status);
        // this.logger.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // this.logger.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        this.logger.error('Error', error.message);
      }
      // this.logger.error(error.config);
      // return of(result as T);
      throw error;
    };
  }

  async findMaster(conditions: unknown = {}): Promise<any> {
    conditions[KEYS.ACTIVE_FLAG] = true;
    conditions[KEYS.DEL_FLAG] = false;
    return await this.post(this.apiByConfigURI, `/master/find`, conditions);
  }

  protected async checkCommonRequired(body: unknown = {}): Promise<string[]> {
    try {
      const errors = [];
      if (!body[`api_key`]) {
        errors.push(`api_key is required.`);
      }
      if (!body[`system`]) {
        errors.push(`system is required.`);
      }

      if (body[`api_key`] && body[`system`]) {
        // check valid api_key
        const conditions = {
          [KEYS.SYSTEM]: body[`system`],
          [KEYS.CLASS]: 'api_key',
        };
        const ret = await this.findMaster(conditions);

        if (isArrayFull(ret)) {
          if (!isEqual(body[`api_key`], ret[0].value)) {
            errors.push(`api_key is not valid.`);
          }
        }
      }

      return errors;
    } catch (error) {
      console.log(error)
    }
  }

  protected setCommonInsert(dto: any): void {
    if (!dto[KEYS.SYSTEM]) {
      dto[KEYS.SYSTEM] = DEFAULT_SYSTEM;
    }
    dto[KEYS.DEL_FLAG] = false;
    dto[KEYS.CREATE_BY] = dto[KEYS.CREATE_BY] || dto[KEYS.SYSTEM];
    dto[KEYS.CHANGE_BY] = dto[KEYS.CHANGE_BY] || dto[KEYS.SYSTEM];
    dto[KEYS.CREATE_AT] = this.getUnixTime();
    dto[KEYS.CHANGE_AT] = this.getUnixTime();
  }

  protected setCommonUpdate(dto: any): void {
    dto[KEYS.CHANGE_BY] = dto[KEYS.CHANGE_BY] || dto[KEYS.SYSTEM];
    dto[KEYS.CHANGE_AT] = this.getUnixTime();
  }

  protected setLogUpdate(dto: any): void {
    dto[KEYS.LOG_BY] = dto[KEYS.LOG_BY] || dto[KEYS.SYSTEM];
    dto[KEYS.LOG_AT] = this.getUnixTime();
  }

  protected clone(obj: any): any {
    if (isArrayFull(obj)) {
      return Object.assign([], obj);
    } else if (isObject(obj)) {
      return Object.assign({}, obj);
    }
  }

  protected getUnixTime() {
    const d1 = new Date();
    const currUTCDate = new Date(
      d1.getUTCFullYear(),
      d1.getUTCMonth(),
      d1.getUTCDate(),
      d1.getUTCHours(),
      d1.getUTCMinutes(),
      d1.getUTCSeconds(),
      d1.getUTCMilliseconds(),
    );
    return currUTCDate.getTime();
  }

  protected getDate(unixTime: number) {
    const utcDate = new Date(unixTime * 1000);
    const tz = new Date().getTimezoneOffset() / 60;
    return utcDate.getTime() - tz * 60 * 1000;
  }
}
