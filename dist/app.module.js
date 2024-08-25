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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const todo_module_1 = require("./todo/todo.module");
const path_1 = require("path");
const http_exception_filter_1 = require("./http-exception.filter");
const core_1 = require("@nestjs/core");
let RootModule = class RootModule {
    constructor() {
        console.log('root module execute');
    }
};
exports.RootModule = RootModule;
exports.RootModule = RootModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true, envFilePath: [
                    '.local.env'
                ]
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    autoLoadEntities: true,
                    synchronize: true,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                    connectTimeoutMS: 10000,
                    retryAttempts: 5,
                    retryDelay: 3000,
                    entities: [(0, path_1.join)(__dirname, '**', '*.entity.{js,ts}')]
                }),
            }),
            user_module_1.UserModule,
            todo_module_1.TodoModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
        ],
    }),
    __metadata("design:paramtypes", [])
], RootModule);
//# sourceMappingURL=app.module.js.map