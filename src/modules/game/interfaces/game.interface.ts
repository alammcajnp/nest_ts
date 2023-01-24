import { Document } from 'mongoose';

export interface Game extends Document {
  readonly game_name: string;
  readonly game_descrition: string;
  readonly created_at: Date;
}
