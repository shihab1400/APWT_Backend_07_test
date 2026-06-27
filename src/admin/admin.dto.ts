import { IsAlpha, IsNotEmpty, Matches, Length } from 'class-validator';

export class AdminDTO {
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsAlpha(undefined, { message: 'Name must contain only alphabets' })
  name?: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty({ message: 'Email address field is required' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.xyz$/, {
    message: 'Email must be a valid address and use the .xyz domain',
  })
  email?: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Length(10, 10, { message: 'Length of NID must be 10' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Matches(/^\d+$/, { message: 'NID must contain only numeric digits' })
  nid?: string;

  profilePic?: string;
}
