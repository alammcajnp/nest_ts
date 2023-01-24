import {
  Injectable,
  HttpService,
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  Query,
  NotFoundException,
  Delete,
  Param
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LabelService } from './label.service';
import { CreateLabelDTO } from './dto/create-label.dto';

@Injectable()
@Controller('label')
export class LabelController {
  constructor(private labelService: LabelService) {}

  // add a label
  @Post('/create')
  async addLabel(@Res() res, @Body() createLabelDTO: CreateLabelDTO) {
    let label_data = await this.labelService.addLabel(createLabelDTO);
    if (!label_data)
      throw new NotFoundException('Some issue, label not created');

    return res.status(HttpStatus.OK).json({
      message: 'Label has been created successfully'
    });
  }

  //get label by game id
  @Get('labelByGameId/:gameID')
  async labelByGameId(@Res() res, @Param('gameID') gameID) {
    const menulabel = await this.labelService.labelByGameId(gameID);
    if (!menulabel) throw new NotFoundException('Label does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'All Labels by game id',
      menulabel
    });
  }

  // Fetch a particular label using ID
  @Get('label/:labelID')
  async getLabel(@Res() res, @Param('labelID') labelID) {
    const label = await this.labelService.getLabel(labelID);
    if (!label) throw new NotFoundException('Label does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Label list',
      label
    });
  }

  // Update a label's details
  @Put('/update')
  async updateGame(
    @Res() res,
    @Query('labelID') labelID,
    @Body() createLabelDTO: CreateLabelDTO
  ) {
    const label = await this.labelService.updateLabel(labelID, createLabelDTO);
    if (!label) throw new NotFoundException('Label does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Label has been successfully updated',
      label
    });
  }

  // Retrieve label list
  @Get('labels')
  async getAllLabels(@Res() res) {
    const labels = await this.labelService.getAllLabels();
    return res.status(HttpStatus.OK).json({
      message: 'All Label',
      labels
    });
  }

  // Delete a Label
  @Delete('/delete')
  async deleteLabel(@Res() res, @Query('labelID') labelID) {
    const label = await this.labelService.deleteLabel(labelID);
    if (!label) throw new NotFoundException('Label does not exist');
    return res.status(HttpStatus.OK).json({
      message: 'Label has been deleted',
      label
    });
  }
}
