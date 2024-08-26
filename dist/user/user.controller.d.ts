import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(createUserDto: RegisterUserDto): Promise<{
        success: boolean;
        message: string;
        user?: User;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        success: boolean;
        message: string;
        user?: User;
        Token?: string;
    }>;
    findAll(): Promise<User[]>;
    deleteUser(deleteUserDto: LoginUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
