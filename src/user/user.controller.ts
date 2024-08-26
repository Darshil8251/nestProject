import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ConflictException, BadRequestException, HttpException, HttpStatus, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { log } from 'console';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))
  async register(@Body(ValidationPipe) createUserDto: RegisterUserDto): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      return await this.userService.register(createUserDto);
    } catch (error) {
      console.log(error)

      if (error instanceof HttpException) {
        const status = error.getStatus();
        const response = error.getResponse();
        throw new HttpException(response, status);
      }
      throw new HttpException(
        { success: false, message: 'An unexpected error occurred' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('login')
  login(@Body(ValidationPipe) loginUserDto: LoginUserDto): Promise<{ success: boolean; message: string; user?: User; Token?: string }> {
    return this.userService.login(loginUserDto);
  }

  @Get('allUser')
  findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Delete('deleteUser')
  deleteUser(@Body(ValidationPipe) deleteUserDto:LoginUserDto){
    return this.userService.deleteUser(deleteUserDto)
  }
}
