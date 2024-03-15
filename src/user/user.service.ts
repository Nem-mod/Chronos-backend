import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model } from 'mongoose';
import { FullUserDto } from './dto/full-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly sendGridService: SendGridService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(user: CreateUserDto): Promise<FullUserDto> {
    user.password = bcrypt.hashSync(
      user.password,
      this.configService.get<number>(`crypt.salt`),
    );

    const newUser: User = new this.userModel(user);

    try {
      await newUser.save();
    } catch (err) {
      if (err.code === 11000)
        throw new ConflictException(`User already exists`);
      console.error(err);
      throw err;
    }

    return newUser;
  }

  async sendVerifyEmail(user: FullUserDto, returnUrl: string): Promise<void> {
    await this.sendGridService.send({
      to: user.email,
      from: this.configService.get(`api.sendgrid.sender`),
      dynamicTemplateData: {
        link: returnUrl,
      },
      templateId: this.configService.get(`api.sendgrid.verify-template`),
    });
  }

  async findByUsername(
    username: CreateUserDto[`username`],
  ): Promise<User | null> {
    return this.userModel.findOne({ username }).lean();
  }

  async findById(id: CreateUserDto[`_id`]): Promise<User | null> {
    return this.userModel.findById(id).lean();
  }

  async update(
    id: CreateUserDto[`_id`],
    user: UpdateUserDto,
  ): Promise<FullUserDto> {
    delete user.password;
    delete user._id;

    try {
      return await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
        projection: { password: 0 },
      });
    } catch (err) {
      if (err.code === 11000)
        throw new ConflictException(`Some fields are already in use`);
      console.error(err);
      throw err;
    }
  }

  async verify(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { verified: true });
  }

  async remove(id: CreateUserDto[`_id`]): Promise<FullUserDto> {
    return this.userModel.findByIdAndDelete(id);
  }
}
