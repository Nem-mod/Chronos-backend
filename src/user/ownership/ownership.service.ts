import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Ownership } from './models/ownership.model';
import { Model } from 'mongoose';
import { OwnershipDto } from './dto/ownership.dto';
import { CreateUserDto } from '../dto/create-user.dto';

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
    return ownership.owners.includes(userId);
  }

  async isGuest(
    ownership: OwnershipDto,
    userId: CreateUserDto[`_id`],
  ): Promise<boolean> {
    return ownership.guests.includes(userId);
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

  // async addOwner(ownership: OwnershipDto, userId: CreateUserDto[`_id`]) {}
}
