export class BaseDto {
  _id: string;
  system: string;
  create_at: number;
  create_by: string;
  change_at: number;
  change_by: string;
  del_flag: boolean;
}

export interface KeyValueDto {
  key: string;
  value: string;
}

export interface LogDto {
  log_id: string;
  log_action: string;
  log_at: number;
  log_by: string;
}
