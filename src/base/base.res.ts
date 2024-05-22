import { ApiProperty } from '@nestjs/swagger';
export class BaseRes {
  @ApiProperty({
    enumName: "SYSTEM",
    required: true,
    description: ``,
  })
  system?: string;
}