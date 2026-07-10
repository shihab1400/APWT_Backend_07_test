import { IsAlpha, IsNotEmpty, Matches, Length } from 'class-validator';

export class AdminDTO {
  adminId: number;

  @IsAlpha(undefined, { message: 'Name must contain only alphabets' })
  name?: string;

  @IsNotEmpty({ message: 'Email address field is required' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.xyz$/, {
    message: 'Email must be a valid address and use the .xyz domain',
  })
  email?: string;

  @Length(10, 10, { message: 'Length of NID must be 10' })
  @Matches(/^\d+$/, { message: 'NID must contain only numeric digits' })
  nid?: string;

  profilePic?: string;
}
