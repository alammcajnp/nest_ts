import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Label } from './interfaces/label.interface';
import { CreateLabelDTO } from './dto/create-label.dto';
import { UtilityService } from '../../services/utility.service';

@Injectable()
export class LabelService {
  constructor(
    @InjectModel('Label') private readonly labelModel: Model<Label>
  ) {}

  // fetch all label
  async getAllLabels(): Promise<Label[]> {
    const games = await this.labelModel.find().exec();
    return games;
  }

  // Get a labels by game id
  async labelByGameId(labelID): Promise<Label[]> {
    let labelsdata = await this.labelModel.find({ game_id: labelID }).exec();
    return labelsdata;
  }

  // Get a single label
  async getLabel(labelID): Promise<Label> {
    const label = await this.labelModel.findById(labelID).exec();
    return label;
  }

  // post a single label
  async addLabel(createLabelDTO: CreateLabelDTO): Promise<Label> {
    const newLabel = new this.labelModel(createLabelDTO);
    return newLabel.save();
  }

  // Edit label details
  async updateLabel(labelID, createLabelDTO: CreateLabelDTO): Promise<Label> {
    const updatedGame = await this.labelModel.findByIdAndUpdate(
      labelID,
      createLabelDTO,
      { new: true }
    );
    return updatedGame;
  }

  // Delete a label
  async deleteLabel(labelID): Promise<any> {
    const deletedLabel = await this.labelModel.findByIdAndRemove(labelID);
    return deletedLabel;
  }
}
