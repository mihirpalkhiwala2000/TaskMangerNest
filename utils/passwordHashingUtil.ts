import { hash } from 'bcrypt';
export const hashedPassword = async (password: string): Promise<string> => {
  const secretPassword = await hash(password, 8);
  return secretPassword;
};
