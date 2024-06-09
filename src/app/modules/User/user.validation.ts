import { z } from 'zod';

const nameSchema = z.string({
    invalid_type_error: 'Name must be a string',
  })
  .regex(/^[a-zA-Z]+$/, 'Name can only contain alphabetic characters');

const passwordSchema = z.string({
    invalid_type_error: 'Password must be string',
  }).min(8, { message: 'Password must be at least 8 characters long' })
  .max(20, { message: 'Password can not be more than 20 characters' })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[@$!%*?&]/, {
    message: 'Password must contain at least one special character',
  });

const createUserValidationSchema = z.object({
  body: z.object({
    name: nameSchema,
    email: z
      .string({
        invalid_type_error: 'Email must be string',
      })
      .email('Invalid email address'),

    password: passwordSchema,
  }),
});

export const UserValidation = {
  createUserValidationSchema,
};
