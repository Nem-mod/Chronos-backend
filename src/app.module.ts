import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { CalendarModule } from './calendar/calendar.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnershipModule } from './ownership/ownership.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    EventModule,
    CalendarModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(`db.mongodb.uri`),
      }),
      inject: [ConfigService],
    }),
    OwnershipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
