import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { Md5 } from 'md5-typescript';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { UtilityService } from '../../services/utility.service';
import { ConfigService } from '@nestjs/config';
import { User } from './interfaces/user.interface';

import { Request } from 'express';

@Injectable()
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private sendgridService: SendgridService,
    private utilityService: UtilityService,
    private configService: ConfigService
  ) {}

  // add a user
  @Post('create')
  async addUser(
    @Res() res,
    @Body() createUserDTO: CreateUserDTO,
    @Req() req: Request
  ) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    createUserDTO.password = Md5.init(createUserDTO.password);
    createUserDTO.status = 1;
    createUserDTO.otp = otp;

    const newUser = await this.userService.addUser(createUserDTO);
    const accessToken = this.utilityService.signJWT({ id: newUser.id });
    const user = {
      email: newUser.email,
      mobile: newUser.mobile,
      full_name: newUser.full_name
    };
    const refreshToken = this.utilityService.signJWT(
      { id: newUser._id },
      'refresh'
    );

    return res.status(HttpStatus.OK).json({
      title: 'You are signed up successfully',
      accessToken,
      refreshToken,
      user
    });
  }

  //login
  @Post('login')
  async loginUser(@Res() res, @Body() loginUserDTO: LoginUserDTO) {
    loginUserDTO.password = Md5.init(loginUserDTO.password);
    const user: User = await this.userService.loginUser(loginUserDTO);
    if (!user) {
      throw new BadRequestException({
        title: 'Login Failed',
        description: 'Invalid email or password'
      });
    }

    const accessToken = this.utilityService.signJWT({ id: user.id });
    const refreshToken = this.utilityService.signJWT(
      { id: user.id },
      'refresh'
    );

    return res.status(HttpStatus.OK).json({ user, accessToken, refreshToken });
  }

  @Get('refresh-token')
  async refreshToken(@Res() res, @Req() req: Request) {
    const payload = { id: req.user['id'] };
    const accessToken = this.utilityService.signJWT(payload);
    const refreshToken = this.utilityService.signJWT(payload, 'refresh');
    return res.status(HttpStatus.OK).json({ accessToken, refreshToken });
  }

  @Post('forget-password')
  async forgetPassword(
    @Res() res,
    @Body() body: LoginUserDTO,
    @Req() req: Request
  ) {
    const token = this.utilityService.signJWT(body);
    const user = await this.userService.forgetPassword(body, token);

    if (user.modifiedCount == 0) {
      throw new BadRequestException({
        title: `No user found with email ${body.email}`
      });
    }

    const host = this.configService.get('WEB_URL');
    const resetLink = `${host}/#/reset-password?token=${token}`;
    if (user.modifiedCount == 1) {
      const mail = {
        to: body.email,
        subject: 'OverTheWire Reset Password',
        from: 'alammca2006@gmail.com',
        // text: 'Hello ',
        html: `Please click this link to reset your password <a target="_blank" href="${resetLink}">${resetLink}</a>`
      };
      await this.sendgridService.send(mail);
    }
    return res.status(HttpStatus.OK).json({
      title: 'Please check your email to reset password',
      ssm: req.headers['ssm']
    });
  }

  @Put('reset-password')
  async updatePassword(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    createUserDTO.password = Md5.init(createUserDTO.password);
    const user = await this.userService.updatePassword(
      createUserDTO.token,
      createUserDTO
    );

    if (user.matchedCount == 0) {
      throw new BadRequestException({
        title: 'Bad Request'
      });
    }

    return res.status(HttpStatus.OK).json({
      title: 'Password reset successfully'
    });
  }

  //verify opt
  @Post('verify-otp')
  async verifyOTP(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.verifyOTP(createUserDTO);
    if (user.modifiedCount == 0)
      throw new NotFoundException('Invalid OTP / Token!');
    return res.status(HttpStatus.OK).json({ message: 'Email verified' });
  }

  // Retrieve users list
  @Get('users')
  async getAllUser(@Res() res) {
    const users = await this.userService.getAllUser();
    return res.status(HttpStatus.OK).json(users);
  }

  // Fetch a particular user using ID
  @Get('user/:userID')
  async getUser(@Res() res, @Param('userID') userID, @Req() req: Request) {
    const user = await this.userService.getUser(userID);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json(user);
  }

  // Update a user's details
  @Put('update')
  async updateUser(
    @Res() res,
    @Body() createUserDTO: CreateUserDTO,
    @Req() req: Request
  ) {
    const userId = req.user['id'];
    const user = await this.userService.updateUser(userId, createUserDTO);
    if (!user) throw new NotFoundException('User does not exist!');
    return res.status(HttpStatus.OK).json({
      title: 'User updated successfully',
      user
    });
  }

  // Delete a User
  @Delete('delete')
  async deleteUser(@Res() res, @Query('userID') userID) {
    const user = await this.userService.deleteUser(userID);
    if (!user) throw new NotFoundException('User does not exist');
    return res.status(HttpStatus.OK).json({
      message: 'User has been deleted',
      user
    });
  }
}
