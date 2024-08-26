"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const constants_1 = require("../utils/constants");
const bcrypt = require("bcrypt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(createUserDto) {
        try {
            const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
            if (existingUser) {
                throw new common_1.ConflictException({ success: false, message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const user = new user_entity_1.User();
            user.firstName = createUserDto.firstName;
            user.lastName = createUserDto.lastName;
            user.password = hashedPassword;
            user.email = createUserDto.email;
            user.role = constants_1.Constants.ROLES.USER;
            const savedUser = await this.userRepository.save(user);
            return { success: true, message: 'User created successfully', user: savedUser };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async login(loginUserDto) {
        try {
            const user = await this.userRepository.findOneBy({ email: loginUserDto.email });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const isPasswordMatch = await bcrypt.compare(loginUserDto.password, user.password);
            if (!isPasswordMatch) {
                throw new common_1.UnauthorizedException('Invalid password');
            }
            return {
                success: true,
                message: 'User found',
                user
            };
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    findAll() {
        try {
            return this.userRepository.find();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteUser(deleteUserDto) {
        try {
            const deleteResult = await this.userRepository.delete({ email: deleteUserDto.email });
            if (deleteResult.affected === 0) {
                throw new common_1.NotFoundException('User not found or could not be deleted');
            }
            return {
                success: true,
                message: 'User successfully deleted',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.ConflictException('User cannot be deleted due to existing dependencies');
        }
    }
    async update(updateUserDto) {
        try {
            let user = await this.userRepository.findOneBy({ email: updateUserDto.email });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
            }
            Object.assign(user_entity_1.User, updateUserDto);
            const updatedUser = await this.userRepository.save(user);
            return {
                success: true,
                message: 'User updated successfully',
                user: updatedUser
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.ConflictException('User cannot be deleted due to existing dependencies');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map