import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "../../base/base.service";
import { ByAccount, ByAccountDocument } from './by-account.schema';
import { ENVIRONMENT } from 'src/commons/enums';

@Injectable()
export class ByAccountService extends BaseService<ByAccount> {
    constructor(
        @InjectModel(ByAccount.name, ENVIRONMENT.MONGODB_URI_BY_USER) protected model: Model<ByAccountDocument>,
    ) {
        super(model);
    }
}
