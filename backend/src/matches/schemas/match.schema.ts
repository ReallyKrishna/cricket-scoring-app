import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
  @Prop({ required: true, unique: true })
  matchId: string;

  @Prop({ required: true })
  team1: string;

  @Prop({ required: true })
  team2: string;

  @Prop({ required: true })
  venue: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: 'active' })
  status: 'active' | 'paused' | 'completed';

  @Prop({ default: 0 })
  team1Score: number;

  @Prop({ default: 0 })
  team2Score: number;

  @Prop({ default: 0 })
  team1Wickets: number;

  @Prop({ default: 0 })
  team2Wickets: number;

  @Prop({ default: 0 })
  currentOver: number;

  @Prop({ default: 0 })
  currentBall: number;

  @Prop({ default: 'team1' })
  battingTeam: 'team1' | 'team2';
}

export const MatchSchema = SchemaFactory.createForClass(Match); 