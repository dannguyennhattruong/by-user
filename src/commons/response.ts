import { ApiProperty } from "@nestjs/swagger";
import { RES_STATUS } from "./enums";
export class ByResponse {
  @ApiProperty({
    type: String,
    description: `
    - OK
    - NG
    `,
  })
  status: RES_STATUS;

  @ApiProperty({
    type: Object,
    required: false,
    description: `
    - {}: if num = 1
    - []: if num > 1
    `,
  })
  result: unknown;

  @ApiProperty({
    type: Object,
    required: false,
    description: `
    - []: error message list
    `,
  })
  errors: unknown;

  @ApiProperty({
    type: Number,
    description: `
    Number record of result, errors
    `,
  })
  num?: number;

  @ApiProperty({
    type: Number,
    description: `
    Total records with conditions
    `,
  })
  total_num?: number;

  constructor(status: RES_STATUS, data?: unknown, totalNum?: number) {
    // set status to return
    this.status = status;
    this.total_num = totalNum;
    // set data to return
    switch (status) {
      case RES_STATUS.OK:
        this.result = data;
        break;
      case RES_STATUS.NG:
        this.result = data;
        break;
      case RES_STATUS.ERROR:
        this.errors = data;
        break;
      default: {
        //statements;
        break;
      }
    }
    // set num data to return
    if (Array.isArray(data)) {
      this.num = data.length;
    } else if (
      data !== undefined &&
      data !== null
    ) {
      this.num = 1;
    }
  }
}
