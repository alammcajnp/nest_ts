import * as mongoose from 'mongoose';

export const LabelSchema = new mongoose.Schema({
  game_id: String,
  label_name: String,
  label_descrition: String,
  created_at: { type: Date, default: Date.now }
});
