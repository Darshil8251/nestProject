import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { Constants } from 'src/utils/constants';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { NotFoundError } from 'rxjs';
import { log } from 'console';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>) { }

  // Register new user
  async register(createUserDto: RegisterUserDto): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });

      if (existingUser) {
        throw new ConflictException({ success: false, message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Create a new user
      const user = new User();
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.password = hashedPassword;
      user.email = createUserDto.email;
      user.role = Constants.ROLES.USER;

      const savedUser = await this.userRepository.save(user);

      return { success: true, message: 'User created successfully', user: savedUser };

    } catch (error) {
      console.log(error)
      throw error
    }
  }

  // Login for new user 
  async login(loginUserDto: LoginUserDto): Promise<{ success: boolean; message: string; user?: User; token?: string }> {
    try {
      const user = await this.userRepository.findOneBy({ email: loginUserDto.email });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordMatch = await bcrypt.compare(loginUserDto.password, user.password)

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid password')
      }

      return {
        success: true,
        message: 'User found',
        user
      }

    } catch (error) {
      console.log(error)
      throw error
    }
  }

}


