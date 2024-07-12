/**
 * Dummy email service, should probably implement with a real email service but good enough for testing purposes
 */

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendEmail(
    email: string,
    subject: string,
    template: string,
  ): Promise<void> {
    Logger.verbose(
      `Sending email to ${email} with subject: ${subject} and message: ${template}`,
    );
  }
}
