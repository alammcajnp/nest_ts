import {
  BadRequestException,
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
import { Md5 } from 'md5-typescript';
import { AdminService } from './admin.service';
import { UtilityService } from '../../services/utility.service';
import { CreateAdminDTO } from './dto/create-admin.dto';
import { Admin } from './interfaces/admin.interface';

@Injectable()
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private utilityService: UtilityService
  ) {}

  @Post('login')
  async loginAdmin(@Res() res, @Body() createAdminDTO: CreateAdminDTO) {
    createAdminDTO.password = createAdminDTO.password = Md5.init(
      createAdminDTO.password
    );
    const admin: Admin[] = await this.adminService.loginAdmin(createAdminDTO);
    if (!admin) {
      throw new BadRequestException({
        title: 'Login Failed',
        description: 'Invalid email or password'
      });
    }

    const accessToken = this.utilityService.signJWT({ id: admin });
    const refreshToken = this.utilityService.signJWT({ id: admin }, 'refresh');

    return res.status(HttpStatus.OK).json({ admin, accessToken, refreshToken });
  }
}
