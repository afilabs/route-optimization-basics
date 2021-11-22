import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export type MetaPaginationType = {
  itemCount: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  [key: string]: any;
};

export class PaginationQueryDto {
  @ApiProperty({
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  currentPage = 1;

  @ApiProperty({
    default: 50,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  itemsPerPage = 50;
}
