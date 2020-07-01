import {
    Module,
    Controller,
    Get,
    Post,
    collectRouters,
    All,
} from "./decorators";

@Controller("/user")
class UserController {
    constructor() {
        console.log("UserController");
    }
    @Get("info/:id")
    hello() {}
    @Post("save")
    hello2() {}
}

@Module({
    constrollers: [UserController],
})
class UserModule {}

@Controller("/")
class AppController {
    constructor() {
        console.log("AppController");
    }
    @Get()
    hello() {}
    @All("test")
    hello2() {}
}

@Module({
    imports: [UserModule],
    constrollers: [AppController],
})
class AppModule {}

console.log(collectRouters(AppModule));
