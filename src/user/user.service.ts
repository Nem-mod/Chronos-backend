import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model } from 'mongoose';
import { FullUserDto } from './dto/full-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  ): Promise<FullUserDto | null> {
    return this.userModel.findOne({ username }).lean();
  }

  async findById(id: CreateUserDto[`_id`]): Promise<FullUserDto | null> {
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

  async remove(id: CreateUserDto[`_id`]): Promise<FullUserDto> {
    return this.userModel.findByIdAndDelete(id);
  }
}
