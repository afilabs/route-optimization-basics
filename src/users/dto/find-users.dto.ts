import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Type } from 'class-transformer';

export class FindUsersDto extends PaginationQueryDto {
  @ApiProperty({
    default: '',
  })
  @IsOptional()
  @Type(() => String)
  name: null;

  @ApiProperty({
    default: '',
  })
  @IsOptional()
  @Type(() => String)
  email: null;
}
