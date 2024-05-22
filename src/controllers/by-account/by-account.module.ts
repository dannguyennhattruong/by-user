import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ByAccountService } from './By-account.service';
import { ByAccountController } from './by-account.controller';
import { ByAccount, ByAccountSchema } from './by-account.schema';
import { ENVIRONMENT } from 'src/commons/enums';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: ByAccount.name, schema: ByAccountSchema, collection : 'by-account' }],
            ENVIRONMENT.MONGODB_URI_BY_USER,
        ),
        HttpModule,
    ],
    providers: [
        ByAccountService, 

    ],
    controllers: [ByAccountController],
    exports: [ByAccountService],
})
export class ByAccountModule { }
