export class CreateUserDTO {
  full_name: string;
  email: string;
  password: string;
  mobile: string;
  status: number;
  token: string;
  otp: number;
  created_at: Date;
}
