import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseController } from "../../base/base.controller";
import { HttpService } from "@nestjs/axios";
import { ByAccountService } from "../By-account/By-account.service";
import { ByAccountDto } from "./by-account.dto";
import { ByResponse } from "src/commons/response";
import { KEYS, RES_STATUS } from "src/commons/enums";


@Controller("by-account")
export class ByAccountController extends BaseController {
    constructor(
        protected httpService: HttpService,
        protected configService: ConfigService,
        protected service: ByAccountService,
    ) {
        super(httpService, configService);
    }

    @Post("find")
    async find(
        @Body() body: ByAccountDto,
        @Res() res
    ): Promise<ByAccountDto | ByAccountDto[]> {
        // check validate
        const errors = [];
        if (errors.length > 0) {
            const result = new ByResponse(RES_STATUS.ERROR, errors);
            this.logger.debug(result);
            return res.status(HttpStatus.BAD_REQUEST).json(result);
        }

        // create conditions
        const conditions: any = {
            [KEYS.DEL_FLAG]: false,
            ...body
        };

    

        console.log(`conditions`, conditions);

        // set select field
        const select = "";

        // query data
        const options = {
            lean: true,
            sort: {
                [KEYS.CHANGE_AT]: -1,
            },
        };
        const ret = await this.service.find(conditions, select, options);
        // return to client
        return res.status(HttpStatus.OK).json(ret);
    }



    @Post("create")
    async createOne(
        @Body() dto: ByAccountDto,
        @Res() res
    ): Promise<ByAccountDto> {
        const ret = await this.service.create(dto);
        // return to client
        return res.status(HttpStatus.OK).json(ret);
    }
    

    @Post("update")
    async updateOne(
        @Body() dto: ByAccountDto,
        @Res() res
    ): Promise<ByAccountDto> {

        const ret = await this.service.update(dto._id, dto);
        // return to client
        return res.status(HttpStatus.OK).json(ret);
    }
}
