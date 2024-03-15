import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Ownership } from './models/ownership.model';
import { Model, Types } from 'mongoose';
import { OwnershipDto } from './dto/ownership.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { FullUserDto } from '../dto/full-user.dto';

@Injectable()
export class OwnershipService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Ownership.name)
    private readonly ownershipModel: Model<Ownership>,
  ) {}

  async isOwner(
    ownership: OwnershipDto,
    userId: CreateUserDto[`_id`],
  ): Promise<boolean> {
    return ownership.owners.some((obj) => {
      let id: string;
      if (obj instanceof FullUserDto) {
        id = obj._id.toString();
      } else {
        id = obj.toString();
      }
      return id === userId.toString();
    });
  }

  async isGuest(
    ownership: OwnershipDto,
    userId: CreateUserDto[`_id`],
  ): Promise<boolean> {
    return ownership.guests.some((obj) => {
      let id: string;
      if (obj instanceof FullUserDto) {
        id = obj._id.toString();
      } else {
        id = obj.toString();
      }
      return id === userId.toString();
    });
  }

  async isUserOwnerOrGuest(
    ownership: OwnershipDto,
    userId: CreateUserDto[`_id`],
  ): Promise<'owner' | 'guest' | null> {
    if (await this.isOwner(ownership, userId)) return 'owner';
    if (await this.isGuest(ownership, userId)) return `guest`;
    return null;
  }

  async createOwnershipModel(ownership: OwnershipDto): Promise<Ownership> {
    const newOwnership: Ownership = new this.ownershipModel(ownership);
    return newOwnership;
  }

  async getAllUsersIds(
    ownership: OwnershipDto,
  ): Promise<CreateUserDto[`_id`][]> {
    return ownership.owners.concat(ownership.guests).map((user) => {
      if (user instanceof FullUserDto) {
        return user._id;
      } else {
        return user;
      }
    });
  }
  // async addOwner(ownership: OwnershipDto, userId: CreateUserDto[`_id`]) {}
}
