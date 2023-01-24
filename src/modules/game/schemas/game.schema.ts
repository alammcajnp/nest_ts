import * as mongoose from 'mongoose';

export const GameSchema = new mongoose.Schema({
  game_name: String,
  game_descrition: String,
  created_at: { type: Date, default: Date.now }
});
