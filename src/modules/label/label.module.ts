import { Module } from '@nestjs/common';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LabelSchema } from './schemas/label.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Label', schema: LabelSchema }])
  ],
  controllers: [LabelController],
  providers: [LabelService]
})
export class LabelModule {}
