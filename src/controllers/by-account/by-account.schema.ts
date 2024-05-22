import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from "../../base/base.entity";

export type ByAccountDocument = HydratedDocument<ByAccount>;

@Schema({
    collection: 'by_account',
})
export class ByAccount extends BaseEntity {

    @Prop({ required: false })
    username: string;

    @Prop({ required: false })
    avatar_url: string;

    @Prop({ required: true })
    status: string;

    @Prop({ required: false })
    refCode: string;

    @Prop({ required: false })
    email: string;

    @Prop({ required: false })
    clientIp: string;

    @Prop({ required: false })
    password: string;

    @Prop({ required: false, default: false })
    is_bot: boolean;

    @Prop({ required: false, default: false })
    is_deleted: boolean;
}

export const ByAccountSchema = SchemaFactory.createForClass(ByAccount);