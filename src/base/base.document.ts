import { SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
export type BaseDocument = BaseEntity & Document;
export const BaseSchema = SchemaFactory.createForClass(BaseEntity);
