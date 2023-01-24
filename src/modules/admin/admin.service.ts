import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './interfaces/admin.interface';
import { CreateAdminDTO } from './dto/create-admin.dto';
import { UtilityService } from '../../services/utility.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admin>
  ) {}

  // Login
  async loginAdmin(createAdminDTO: CreateAdminDTO): Promise<Admin[]> {
    const admin = await this.adminModel
      .find(createAdminDTO, { email: 1, mobile: 1, full_name: 1, _id: 1 })
      .exec();
    return admin;
  }
}
