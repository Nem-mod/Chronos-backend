import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model } from 'mongoose';
import { FullUserDto } from './dto/full-user.dto';
import ErrorCodes from 'mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(user: CreateUserDto): Promise<FullUserDto> {
    user.password = bcrypt.hashSync(
      user.password,
      this.configService.get<number>(`crypt.salt`),
    );

    const newUser = new this.userModel(user);

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

  async findByUsername(
    username: CreateUserDto[`username`],
  ): Promise<FullUserDto | undefined> {
    return this.userModel.findOne({ username }).lean();
  }

  async findById(id: string): Promise<FullUserDto | undefined> {
    return this.userModel.findById(id);
  }
}
