import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsArrayOfIds(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isArrayOfIds',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            Array.isArray(value) &&
            value.every(item => Number.isInteger(item) && item > 0)
          );
        },
        defaultMessage() {
          return 'Each subjectId must be a positive integer';
        },
      },
    });
  };
}