export const EmailTemplates = {
  TEST_REMINDER: (subject: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Напоминание о тестировании</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .footer { font-size: 12px; color: #7f8c8d; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Напоминание о тестировании</h2>
      </div>
      <p>Уважаемый студент,</p>
      <p>Напоминаем вам о необходимости пройти тестирование по предмету: <strong>${subject}</strong>.</p>
      <p>Пожалуйста, не оставляйте это на последний момент.</p>
      <div class="footer">
        <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</p>
        <p>© ${new Date().getFullYear()} Учебный портал</p>
      </div>
    </body>
    </html>
  `,

  EXAM_REMINDER: (subject: string, datetime?: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Напоминание об экзамене</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .footer { font-size: 12px; color: #7f8c8d; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Напоминание об экзамене</h2>
      </div>
      <p>Уважаемый студент,</p>
      <p>Напоминаем вам о предстоящем экзамене по предмету <strong>${subject}</strong>${
        datetime ? `, который состоится <strong>${datetime}</strong>` : ''
      }.</p>
      <p>Рекомендуем заранее подготовиться к экзамену.</p>
      <div class="footer">
        <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</p>
        <p>© ${new Date().getFullYear()} Учебный портал</p>
      </div>
    </body>
    </html>
  `,
  
  MEETING_REMINDER: (subject: string, datetime?: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Напоминание о встрече</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .footer { font-size: 12px; color: #7f8c8d; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Напоминание о встрече</h2>
      </div>
      <p>Уважаемый куратор,</p>
      <p>Напоминаем вам о предстоящей встрече по теме <strong>${subject}</strong>${
        datetime ? `, которая состоится <strong>${datetime}</strong>` : ''
      }.</p>
      <p>Пожалуйста, подготовьтесь заранее.</p>
      <div class="footer">
        <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</p>
        <p>© ${new Date().getFullYear()} Учебный портал</p>
      </div>
    </body>
    </html>
  `,

  DEADLINE_REMINDER: (subject: string, datetime?: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Напоминание о дедлайне</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .footer { font-size: 12px; color: #7f8c8d; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Напоминание о дедлайне</h2>
      </div>
      <p>Уважаемый куратор,</p>
      <p>Напоминаем вам о приближающемся дедлайне для задачи <strong>${subject}</strong>${
        datetime ? `, который наступит <strong>${datetime}</strong>` : ''
      }.</p>
      <p>Пожалуйста, завершите все необходимые действия до указанной даты.</p>
      <div class="footer">
        <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</p>
        <p>© ${new Date().getFullYear()} Учебный портал</p>
      </div>
    </body>
    </html>
  `
};