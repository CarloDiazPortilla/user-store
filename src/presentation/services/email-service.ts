import nodemailer, { type Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}

interface EmailServiceOptions {
  service: string;
  user: string;
  pass: string;
}

export class EmailService {
  private transporter: Transporter

  constructor({ service, user, pass }: EmailServiceOptions) {
    this.transporter = nodemailer.createTransport({
      service,
      auth: {
        user,
        pass
      }
    })
  }


  async sendEmail(options: SendMailOptions): Promise<boolean> {

    const { to, subject, htmlBody, attachements = [] } = options;


    try {

      await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });

      return true;
    } catch (error) {
      return false;
    }

  }
}