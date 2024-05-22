import { BaseDto } from '../../base/base.dto';

export class ByAccountDto extends BaseDto {
    username: string;

    avatar_url: string;

    status: string;

    refCode: string;

    email: string;

    clientIp: string;

    password: string;

    is_bot: boolean;

    is_deleted: boolean;
}

