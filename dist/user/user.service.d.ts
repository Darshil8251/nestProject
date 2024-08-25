import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(createUserDto: RegisterUserDto): Promise<{
        success: boolean;
        message: string;
        user?: User;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        success: boolean;
        message: string;
        user?: User;
        token?: string;
    }>;
}
