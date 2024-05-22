import { ApiProperty } from "@nestjs/swagger";
export class BaseReq {
  @ApiProperty({
    type: String,
    required: true,
    description: `Each system will be provided separately`,
  })
  api_key?: string;

  @ApiProperty({
    enumName: "SYSTEM",
    required: true,
    description: ``,
  })
  system?: string;
}
