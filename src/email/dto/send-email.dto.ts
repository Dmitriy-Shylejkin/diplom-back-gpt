import { Type } from 'class-transformer';
import { IsNumber, IsString, IsObject, IsIn, IsOptional, ValidateNested} from 'class-validator';

export const EmailTemplateKeys = ['TEST_REMINDER', 'EXAM_REMINDER'] as const;
export type EmailTemplateKey = typeof EmailTemplateKeys[number];

export class ContextDto {
  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  datetime?: string;
}

export class SendEmailDto {
  @IsNumber()
  groupId: number;

  @IsString()
  @IsIn(EmailTemplateKeys)
  templateKey: EmailTemplateKey;

  @IsObject()
  @ValidateNested()
  @Type(() => ContextDto)
  context: ContextDto;
}
