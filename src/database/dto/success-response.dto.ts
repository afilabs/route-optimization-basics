import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ default: 'You action has been completed successfully.' })
  message = 'You action has been completed successfully.';
}
