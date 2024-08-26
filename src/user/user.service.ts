import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  // Collect all user
  findAll(): Promise<User[]> {
    try {
      return this.userRepository.find()
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  // Delete the user 
  async deleteUser(deleteUserDto: LoginUserDto): Promise<{ success: boolean; message: string }> {
    try {
      const deleteResult = await this.userRepository.delete({ email: deleteUserDto.email });

      if (deleteResult.affected === 0) {
        throw new NotFoundException('User not found or could not be deleted');
      }

      return {
        success: true,
        message: 'User successfully deleted',
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ConflictException('User cannot be deleted due to existing dependencies');
    }
  }

  // Update user
  async update(updateUserDto:RegisterUserDto){

    try {
     let user= await this.userRepository.findOneBy({email:updateUserDto.email})

     if (!user){
      throw new NotFoundException('User not found')
     }

     if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(User,updateUserDto)
    const updatedUser = await this.userRepository.save(user)
    return {
      success:true,
      message:'User updated successfully',
      user:updatedUser
    }
     

      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ConflictException('User cannot be deleted due to existing dependencies');
    }
  }
}


