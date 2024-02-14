import Joi from '@hapi/joi';
import { Expand } from 'src/types/helper.type';

export type SchemaType<TSchema> = Expand<{
  [key in keyof TSchema]: TSchema[key] extends Joi.StringSchema
    ? string
    : TSchema[key] extends Joi.NumberSchema
    ? number
    : TSchema[key] extends Joi.BooleanSchema
    ? boolean
    : string;
}>;

export type SchemaTypeConfs = { [n in string]: Joi.Schema };

export type RedisConnectionOptions = {
  url: string;
  host: string;
  port: number;
  passphrase: string;
};
