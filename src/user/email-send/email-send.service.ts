import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { SendLinkDto } from './dto/send-link.dto';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class EmailSendService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly sendGridService: SendGridService,
  ) {}

  async prepareLink(
    payload: JwtPayloadDto,
    linkInfo: SendLinkDto,
    options: JwtSignOptions,
    replaceWord: string,
  ): Promise<SendLinkDto> {
    const token = this.jwtService.sign(payload, options);
    linkInfo.returnUrl = linkInfo.returnUrl.replace(replaceWord, token);
    return linkInfo;
  }

  async sendEmail(email: string, templateId: string, data: {}): Promise<void> {
    await this.sendGridService.send({
      to: email,
      from: this.configService.get(`api.sendgrid.sender`),
      dynamicTemplateData: data,
      templateId: templateId,
    });
  }

  async validateTokenFromEmail(
    token: string,
    options: JwtVerifyOptions,
  ): Promise<any> {
    try {
      return this.jwtService.verify(token, options);
    } catch (err) {
      throw new BadRequestException(`Token is invalid`);
    }
  }
}
