import { plainToInstance } from 'class-transformer'
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    validateSync,
} from 'class-validator'

enum AppMode {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
}

class EnvironmentVariables {
    @IsNotEmpty()
    @IsEnum(AppMode)
    APP_MODE: string

    @IsNotEmpty()
    @IsNumber()
    APP_PORT: number


    @IsNotEmpty()
    @IsNumber()
    SERVICE_B_PORT: number

    @IsNotEmpty()
    @IsString()
    SERVICE_B_HOST: string

    @IsNotEmpty()
    @IsNumber()
    MONGODB_PORT_EXTERNAL: number

    @IsNotEmpty()
    @IsNumber()
    MONGODB_PORT_INTERNAL: number

    @IsNotEmpty()
    @IsString()
    MONGO_INITDB_ROOT_USERNAME: string

    @IsNotEmpty()
    @IsString()
    MONGO_INITDB_ROOT_PASSWORD: string

    @IsNotEmpty()
    @IsString()
    MONGO_HOST: string

    @IsNotEmpty()
    @IsNumber()
    REDIS_PORT_EXTERNAL: number

    @IsNotEmpty()
    @IsNumber()
    REDIS_PORT_INTERNAL: number

    @IsNotEmpty()
    @IsString()
    REDIS_PASSWORD: string

    @IsNotEmpty()
    @IsString()
    REDIS_USERNAME: string

    @IsNotEmpty()
    @IsString()
    REDIS_HOST: string

    @IsNotEmpty()
    @IsNumber()
    KAFKA_PORT_EXTERNAL: number

    @IsNotEmpty()
    @IsNumber()
    KAFKA_PORT_INTERNAL: number

    @IsNotEmpty()
    @IsString()
    KAFKA_HOST: string

    @IsNotEmpty()
    @IsString()
    KAFKA_USERNAME: string

    @IsNotEmpty()
    @IsString()
    KAFKA_PASSWORD: string
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    })
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    })

    if (errors.length > 0) {
        throw new Error(errors.toString())
    }

    return validatedConfig
}