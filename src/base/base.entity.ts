import { Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export class BaseEntity {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    auto: true,
  })
  _id: string;

  @Prop({ required: true })
  system: string;

  @Prop({ required: true })
  create_at: number;

  @Prop({ required: true })
  create_by: string;

  @Prop({ required: true })
  change_at: number;

  @Prop({ required: true })
  change_by: string;

  @Prop({ required: true })
  del_flag: boolean;
}
