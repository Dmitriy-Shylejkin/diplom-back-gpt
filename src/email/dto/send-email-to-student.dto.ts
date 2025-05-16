import { IsIn, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { ContextDto, EmailTemplateKey, EmailTemplateKeys } from "./send-email.dto";
import { Type } from "class-transformer";


export class SendEmailToStudentDto {
  @IsNumber()
  studentId: number;

  @IsString()
  @IsIn(EmailTemplateKeys)
  templateKey: EmailTemplateKey;


  @IsObject()
  @ValidateNested()
  @Type(() => ContextDto)
  context: ContextDto;
}