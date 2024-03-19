import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsOneOrNoneFieldPresent(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isOneOrNoneFieldPresent',
      target: object.constructor,
      propertyName: propertyName,
      constraints: properties,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const values = properties.map((prop) => (args.object as any)[prop]);
          const presentedCount = values.filter(
            (val) => val !== undefined,
          ).length;
          return presentedCount <= 1;
        },
      },
    });
  };
}
