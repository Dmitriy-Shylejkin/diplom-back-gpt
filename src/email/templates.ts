export const EmailTemplates = {
  TEST_REMINDER: (subject: string) =>
    `<p>Уважаемые студенты, напоминаю о необходимости пройти тестирование по предмету: <strong>${subject}</strong>.</p>`,

  EXAM_REMINDER: (subject: string, datetime: string) =>
    `<p>Уважаемые студенты, напоминаю о экзамене по предмету <strong>${subject}</strong> в <strong>${datetime}</strong>.</p>`,
};
