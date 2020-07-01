import "reflect-metadata";

export function Controller(path?: string) {
    return (target: any) => {
        Reflect.defineMetadata("Path", path || "/", target);
    };
}

export function Get(path?: string) {
    return (target: any, key: any, descriptor: any) => {
        Reflect.defineMetadata("Path", path || "/", descriptor.value);
        Reflect.defineMetadata("Method", "GET", descriptor.value);
    };
}

export function Post(path?: string) {
    return (target: any, key: any, descriptor: any) => {
        Reflect.defineMetadata("Path", path || "/", descriptor.value);
        Reflect.defineMetadata("Method", "POST", descriptor.value);
    };
}

export function All(path?: string) {
    return (target: any, key: any, descriptor: any) => {
        Reflect.defineMetadata("Path", path || "/", descriptor.value);
        Reflect.defineMetadata("Method", "ALL", descriptor.value);
    };
}

export function Module(metadata: any) {
    return (target) => {
        Reflect.defineMetadata("controllers", metadata.constrollers, target);
        Reflect.defineMetadata("imports", metadata.imports, target);
        Reflect.defineMetadata("exports", metadata.exports, target);
        Reflect.defineMetadata("providers", metadata.providers, target);
    };
}

export function collectRouters(module, routers = []) {
    const controllers: any[] = Reflect.getMetadata("controllers", module) || [];
    const imports: any[] = Reflect.getMetadata("imports", module) || [];

    for (let i = 0; i < controllers.length; i++) {
        const ctrl = controllers[i];
        let rPath = Reflect.getMetadata("Path", ctrl);

        if (rPath == null) continue;

        const instance = new ctrl();
        const methods = Object.getOwnPropertyNames(ctrl.prototype);
        methods.forEach((key) => {
            // 忽略构造函数
            if (key === "constructor") {
                return;
            }

            let path = Reflect.getMetadata("Path", ctrl.prototype[key]);
            const method = Reflect.getMetadata("Method", ctrl.prototype[key]);

            if (path) {
                if (path[0] !== "/") {
                    path = "/" + path;
                }

                routers.push({
                    method,
                    path: [rPath, path].join("").replace(/\/\//g, "/"),
                    methodName: key,
                    instance,
                });
            }
        });
    }

    for (let i = 0; i < imports.length; i++) {
        collectRouters(imports[i], routers);
    }

    return routers;
}
