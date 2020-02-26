import * as bcrypt from "bcryptjs";

export interface User {
  user_id: number;
  email: string;
  password: string;
  birth_date?: string;
  first_name: string;
  second_name?: string;
  date_created: Date;
  date_updated?: Date;
  profile_picture_url?: string;
  ismale?: boolean;
}

export function checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, hashPassword: string) {
  return bcrypt.compareSync(unencryptedPassword, hashPassword);
}

export function hashPassword(password: string) {
  return password = bcrypt.hashSync(password, 10);
}