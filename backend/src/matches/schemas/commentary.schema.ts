import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentaryDocument = Commentary & Document;

@Schema({ timestamps: true })
export class Commentary {
  @Prop({ type: Types.ObjectId, ref: 'Match', required: true })
  matchId: Types.ObjectId;

  @Prop({ required: true })
  over: number;

  @Prop({ required: true })
  ball: number;

  @Prop({ required: true })
  eventType: 'run' | 'wicket' | 'wide' | 'no-ball' | 'bye' | 'leg-bye' | 'dot' | 'four' | 'six';

  @Prop({ required: true })
  description: string;

  @Prop({ default: 0 })
  runs: number;

  @Prop({ default: false })
  isWicket: boolean;

  @Prop({ default: false })
  isExtra: boolean;

  @Prop({ default: '' })
  extraType: string;

  @Prop({ default: 0 })
  extraRuns: number;

  @Prop({ default: '' })
  batsman: string;

  @Prop({ default: '' })
  bowler: string;
}

export const CommentarySchema = SchemaFactory.createForClass(Commentary); 