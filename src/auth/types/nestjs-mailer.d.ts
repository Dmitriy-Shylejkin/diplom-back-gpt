declare module '@nestjs-modules/mailer' {
  import { DynamicModule, ModuleMetadata, Provider } from '@nestjs/common';

  export interface MailerModuleOptions {
    transport: any;
    defaults?: any;
    template?: {
      dir: string;
      adapter: any;
      options?: any;
    };
  }

  export interface MailerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any[]) => MailerModuleOptions | Promise<MailerModuleOptions>;
    inject?: any[];
  }

  export class MailerModule {
    static forRoot(options: MailerModuleOptions): DynamicModule;
    static forRootAsync(options: MailerModuleAsyncOptions): DynamicModule;
  }

  export class MailerService {
    sendMail(options: any): Promise<any>;
  }
}

declare module '@nestjs-modules/mailer/dist/adapters/handlebars.adapter' {
  export class HandlebarsAdapter {
    constructor(options?: any, adapterOptions?: any);
  }
}
