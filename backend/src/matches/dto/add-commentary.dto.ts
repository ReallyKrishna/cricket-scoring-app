import { IsNumber, IsString, IsNotEmpty, IsIn, IsOptional, IsBoolean } from 'class-validator';

export class AddCommentaryDto {
  @IsNumber()
  @IsNotEmpty()
  over: number;

  @IsNumber()
  @IsNotEmpty()
  ball: number;

  @IsString()
  @IsIn(['run', 'wicket', 'wide', 'no-ball', 'bye', 'leg-bye', 'dot', 'four', 'six'])
  @IsNotEmpty()
  eventType: 'run' | 'wicket' | 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'dot' | 'four' | 'six';

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  runs?: number;

  @IsBoolean()
  @IsOptional()
  isWicket?: boolean;

  @IsBoolean()
  @IsOptional()
  isExtra?: boolean;

  @IsString()
  @IsOptional()
  extraType?: string;

  @IsNumber()
  @IsOptional()
  extraRuns?: number;

  @IsString()
  @IsOptional()
  batsman?: string;

  @IsString()
  @IsOptional()
  bowler?: string;
} 