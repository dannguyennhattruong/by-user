import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Connection, Model, Types } from "mongoose";
import { DEFAULT_SYSTEM, LOGGED_COLLECTIONS } from "../commons/consts";
import { ENVIRONMENT, KEYS, LOG_ACTIONS } from "../commons/enums";
import { LogDto } from "./base.dto";
import { BaseEntity } from "./base.entity";

@Injectable()
export class BaseService<T> {
    collections_logged = LOGGED_COLLECTIONS;
    collection_name: string;
    collection_log: string;
    db_connection: Connection;
    configService: ConfigService;

    constructor(@InjectModel(BaseService.name) protected model: Model<T>) {
        this.configService = new ConfigService();
        this.db_connection = new Connection();

        const uriLog = this.configService.get<string>(ENVIRONMENT.MONGODB_URI_LOG);
        // add log uri
        this.db_connection.openUri(uriLog);

        this.collection_name = model.collection.name;

        //Check current collection name is in logged collections ?
        if (this.collections_logged.includes(this.collection_name)) {
            this.collection_log = this.collection_name + KEYS.LOG_EXTENSION;
        }
    }

    async find(
        conditions = {},
        select?: unknown,
        options: unknown = {
            lean: true,
        }
    ): Promise<T[]> {
        const query = this.model.find(conditions);
        if (select) {
            query.select(select as any);
        }
        query.setOptions(options);
        return <T[]>await query.exec().then((docs) => {
            let result = docs.map((doc) => {
                return doc;
            });
            return result;
        });
    }

    async findOne(
        conditions = {},
        select?: unknown,
        options: unknown = {
            lean: true,
        }
    ): Promise<T> {
        const query = this.model.findOne(conditions);
        if (select) {
            query.select(select as any);
        }
        query.setOptions(options);
        return <T>await query.exec().then((doc) => {
            return doc
        });
    }

    async count(conditions = {}): Promise<number> {
        return await (this.model as any).count(conditions);
    }

    async findAll(): Promise<T[]> {
        return await this.model.find().exec();
    }

    async findById(id: string): Promise<T> {
        return await this.model.findById(id).exec();
    }

    async create(dto: unknown = {}): Promise<T | BaseEntity> {
        if (this.collection_log) {
            // create log record
            const log_dto = this.createLogRecord(dto, LOG_ACTIONS.CREATE);
            const saveLog = await this.db_connection.db
                .collection(this.collection_log)
                .insertOne(log_dto);

            // Check if sav successfull
            if (!saveLog?.acknowledged) {
                throw new NotFoundException(`Saving log unsuccessfully`);
            }
        }
        this.setCommonInsert(dto);
        const entity = new this.model(dto);
        return entity.save() as any;
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

    async update(id: string, dto: any = {}): Promise<T | BaseEntity> {
        if (this.collection_log) {
            // get current information in db
            const current_information = await this.model.findOne({ _id: id }).exec();
            if (current_information) {
                // create log record

                const log_dto = this.createLogRecord(
                    current_information,
                    LOG_ACTIONS.UPDATE
                );

                const saveLog = await this.db_connection.db
                    .collection(this.collection_log)
                    .insertOne(log_dto);

                // Check if sav successfull
                if (!saveLog?.acknowledged) {
                    throw new NotFoundException(
                        `Saving log for ${id} to ${this.collection_log} unsuccessfully`
                    );
                }

            } else {
                throw new NotFoundException(
                    `Saving log for ${id} to ${this.collection_log} unsuccessfully`
                );
            }
        }
        const options = {
            returnOriginal: false,
            lean: true,
        };
        this.setCommonUpdate(dto);
        const entity = await this.model.findByIdAndUpdate(id, dto, options);

        if (!entity) {
            throw new NotFoundException(`#${id} not found`);
        }
        return entity;
    }

    async updateByCondition(condition: any = {}, dto: any = {}): Promise<T | BaseEntity> {
        const current_information = await this.model.findOne({ ...condition }).exec();

        if (this.collection_log) {
            // get current information in db
            if (current_information) {
                // create log record

                const log_dto = this.createLogRecord(
                    current_information,
                    LOG_ACTIONS.UPDATE
                );

                const saveLog = await this.db_connection.db
                    .collection(this.collection_log)
                    .insertOne(log_dto);

                // Check if sav successfull
                if (!saveLog?.acknowledged) {
                    throw new NotFoundException(
                        `Saving log for ${current_information?.id} to ${this.collection_log} unsuccessfully`
                    );
                }

            } else {
                throw new NotFoundException(
                    `Saving log for ${current_information?.id} to ${this.collection_log} unsuccessfully`
                );
            }
        }
        const options = {
            returnOriginal: false,
            lean: true,
        };
        this.setCommonUpdate(dto);
        const entity = await this.model.findByIdAndUpdate(current_information?.id, dto, options);

        if (!entity) {
            throw new NotFoundException(`#${current_information?.id} not found`);
        }
        return entity;
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

    async delete(id: string): Promise<T | BaseEntity> {
        if (this.collection_log) {
            // get current information in db
            const current_information = await this.model.findOne({ _id: id }).exec();
            if (current_information) {
                // create log record
                const log_dto = this.createLogRecord(
                    current_information,
                    LOG_ACTIONS.DELETE
                );
                const saveLog = await this.db_connection.db
                    .collection(this.collection_log)
                    .insertOne(log_dto);

                // Check if sav successfull
                if (!saveLog?.acknowledged) {
                    throw new NotFoundException(
                        `Saving log for ${id} to ${this.collection_log} unsuccessfully`
                    );
                }
            } else {
                throw new NotFoundException(
                    `Saving log for ${id} to ${this.collection_log} unsuccessfully`
                );
            }
        }

        return await this.model.findByIdAndDelete(id).exec();
    }

    protected createLogRecord(dto: T | any, action: string) {
        const logDto: LogDto = {} as LogDto;
        logDto.log_action = action;
        logDto.log_at = Date.now();
        logDto.log_by = dto?.change_by;
        logDto.log_id = new Types.ObjectId().toString();

        dto = { ...(action !== LOG_ACTIONS.CREATE ? dto._doc : dto), ...logDto };
        dto._id = null;
        return {
            ...dto,
            ...logDto,
        };
    }
}
