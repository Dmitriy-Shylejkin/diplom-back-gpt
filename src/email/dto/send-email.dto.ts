import { IsNumber, IsString, IsObject, IsIn } from 'class-validator';

export const EmailTemplateKeys = ['TEST_REMINDER', 'EXAM_REMINDER'] as const;
export type EmailTemplateKey = typeof EmailTemplateKeys[number];

export class SendEmailDto {
  @IsNumber()
  groupId: number;

  @IsString()
  @IsIn(EmailTemplateKeys)
  templateKey: EmailTemplateKey;

  @IsObject()
  context: Record<string, any>;
}
