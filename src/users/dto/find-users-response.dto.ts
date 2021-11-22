import { ApiProperty } from '@nestjs/swagger';
import { MetaPaginationType } from '../../common/dto/pagination-query.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { User } from '../../database/schemas/user.schema';

export class FindUsersResponseDto {
  @ApiProperty({
    default: [],
  })
  users: UserResponseDto[] = [];

  @ApiProperty({
    default: {
      itemCount: 20,
      totalItems: 30,
      totalPages: 2,
      currentPage: 1,
      itemsPerPage: 20,
      name: 'Lucas Truong',
      email: 'lucas.truong.ex@gmail.com',
    },
  })
  meta: MetaPaginationType;

  constructor(users: User[], total: number, pagination: any) {
    users.forEach((user) => {
      const userResponse = new UserResponseDto(user);
      this.users.push(userResponse);
    });

    const limit = pagination.itemsPerPage;
    this.meta = {
      ...pagination,
      itemCount: users.length,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
