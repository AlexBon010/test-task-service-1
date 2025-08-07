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
    MONGODB_PORT: number

    @IsNotEmpty()
    @IsString()
    MONGODB_HOST: string

    @IsNotEmpty()
    @IsNumber()
    REDIS_PORT: number

    @IsNotEmpty()
    @IsString()
    REDIS_HOST: string

    @IsNotEmpty()
    @IsNumber()
    KAFKA_PORT: number

    @IsNotEmpty()
    @IsString()
    KAFKA_HOST: string

    @IsNotEmpty()
    @IsString()
    KAFKA_LOGS_CLIENT: string
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