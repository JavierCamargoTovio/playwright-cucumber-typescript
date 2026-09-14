const config = {
  paths: ['src/features/**/*.feature'],
  require: ['src/support/**/*.ts', 'src/step-definitions/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    'summary',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
  ],
  formatOptions: {
    snippetInterface: 'async-await',
  },
  publishQuiet: true,
};

module.exports = {
  default: config,
};
