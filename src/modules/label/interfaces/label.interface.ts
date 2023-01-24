import { Document } from 'mongoose';

export interface Label extends Document {
  readonly game_id: string;
  readonly label_name: string;
  readonly label_descrition: string;
  readonly created_at: Date;
}
