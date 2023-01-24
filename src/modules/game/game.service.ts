import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './interfaces/game.interface';
import { CreateGameDTO } from './dto/create-game.dto';
import { UtilityService } from '../../services/utility.service';

@Injectable()
export class GameService {
  constructor(@InjectModel('Game') private readonly gameModel: Model<Game>) {}

  // fetch all Game
  async getAllGame(): Promise<Game[]> {
    const games = await this.gameModel.find().exec();
    return games;
  }

  // Get a single game
  async getGame(gameID): Promise<Game> {
    const game = await this.gameModel.findById(gameID).exec();
    return game;
  }

  // post a single game
  async addGame(createGameDTO: CreateGameDTO): Promise<Game> {
    const newGame = new this.gameModel(createGameDTO);
    return newGame.save();
  }

  // Edit game details
  async updateGame(gameID, createGameDTO: CreateGameDTO): Promise<Game> {
    const updatedGame = await this.gameModel.findByIdAndUpdate(
      gameID,
      createGameDTO,
      { new: true }
    );
    return updatedGame;
  }

  // Delete a game
  async deleteGame(gameID): Promise<any> {
    const deletedGame = await this.gameModel.findByIdAndRemove(gameID);
    return deletedGame;
  }
}
