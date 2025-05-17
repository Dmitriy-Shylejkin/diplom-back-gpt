import { IsIn, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { ContextDto } from "./send-email.dto";
import { Type } from "class-transformer";

export const EmailTemplateKeys = ['MEETING_REMINDER', 'DEADLINE_REMINDER'] as const;
export type EmailTemplateKey = typeof EmailTemplateKeys[number];

export class SendEmailToCuratorsDto {
  @IsString()
  @IsIn(EmailTemplateKeys)
  templateKey: EmailTemplateKey;

  @IsObject()
  @ValidateNested()
  @Type(() => ContextDto)
  context: ContextDto;
}

export class SendEmailToCuratorByIdDto {
  @IsNumber()
  curatorId: number;

  @IsString()
  @IsIn(EmailTemplateKeys)
  templateKey: EmailTemplateKey;

  @IsObject()
  @ValidateNested()
  @Type(() => ContextDto)
  context: ContextDto;
}