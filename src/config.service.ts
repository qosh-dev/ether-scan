import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import { ConfigService as BaseConfigService } from '@nestjs/config';
import { SchemaType, SchemaTypeConfs } from './types/config.type';

@Injectable()
export class ConfigService {
  schema = {
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .required(),
    ETHERSCAN_TOKEN: Joi.string().required(),
    COIN_MARKET_CAP_TOKEN: Joi.string().required(),
    COVALENT_TOKEN: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string().required(),

    TELEGRAM_BOT_TOKEN: Joi.string().optional(),
    TELEGRAM_BOT_CHAT_ID: Joi.number().optional(),
  };
  confs: SchemaType<typeof this.schema>;

  constructor(readonly configService: BaseConfigService) {
    const schemaConfs = this.validate(this.schema);
    this.confs = schemaConfs;
  }

  get redisOptions() {
    let url = `redis://:@${this.confs.REDIS_HOST}:${this.confs.REDIS_PORT}/1`;

    if (this.confs.NODE_ENV === 'production') {
      url = `redis://:${this.confs.REDIS_PASSWORD}@${this.confs.REDIS_HOST}:${this.confs.REDIS_PORT}/1`;
    }
    return {
      url,
      host: this.confs.REDIS_HOST,
      port: this.confs.REDIS_PORT,
      passphrase: this.confs.REDIS_PASSWORD,
    };
  }

 get telegramBotOptions(){
  if(!this.confs.TELEGRAM_BOT_TOKEN || !this.confs.TELEGRAM_BOT_CHAT_ID) return
  return {
    token: this.confs.TELEGRAM_BOT_TOKEN,
    chatId: this.confs.TELEGRAM_BOT_CHAT_ID
  }
  }

  // ------------------------------------------------------------------

  private validate<EnvT extends SchemaTypeConfs>(envSchema: EnvT) {
    const validationSchema = Joi.object(envSchema);

    const { error, value } = validationSchema.validate(process.env, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    let result = {} as SchemaType<EnvT>;

    for (const key in envSchema) {
      result[key as any] = value[key] as any;
    }

    return result;
  }
}
