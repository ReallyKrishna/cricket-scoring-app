import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class StartMatchDto {
  @IsString()
  @IsNotEmpty()
  team1: string;

  @IsString()
  @IsNotEmpty()
  team2: string;

  @IsString()
  @IsNotEmpty()
  venue: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;
} 