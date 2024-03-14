import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { ConfigService } from '@nestjs/config';
import { OwnershipService } from './ownership.service';
import { Ownership, OwnershipSchema } from './models/ownership.model';

@Module({
  imports: [
    SendGridModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        apikey: configService.get(`api.sendgrid.key`),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Ownership.name, schema: OwnershipSchema },
    ]),
  ],
  providers: [UserService, OwnershipService],
  exports: [UserService, OwnershipService],
})
export class UserModule {}
