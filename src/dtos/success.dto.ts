import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  code: number;

  constructor(message: string, code = 200) {
    this.code = code;
    this.message = message;
  }
}
