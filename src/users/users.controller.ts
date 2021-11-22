import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { FindUsersResponseDto } from './dto/find-users-response.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { Public } from '../auth/decorators/auth.decorator';
import { SuccessResponseDto } from '../database/dto/success-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserResponseDto })
  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createNewUser(createUserDto);
  }

  @ApiOkResponse({ type: UserResponseDto })
  @Public()
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @ApiOkResponse({ type: SuccessResponseDto })
  @Public()
  @Delete(':id')
  async removeUserGroup(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }

  @ApiOkResponse({ type: FindUsersResponseDto })
  @Public()
  @Get()
  async findAll(@Query() findUsersDto: FindUsersDto) {
    return await this.usersService.findAllUsers(findUsersDto);
  }
}
