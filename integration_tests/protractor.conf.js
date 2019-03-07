import ConsoleReporter from 'jasmine-console-reporter';

exports.config = {
  framework: 'jasmine',
  suites: {
    base: ['tests/base.scenario.js']
  },
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--window-size=1920,1200',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-raf-throttling'
      ],
      prefs: {
        'profile.password_manager_enabled': false,
        credentials_enable_service: false, // eslint-disable-line @typescript-eslint/camelcase
        password_manager_enabled: false // eslint-disable-line @typescript-eslint/camelcase
      }
    }
  },
  onPrepare: () => {
    browser.ignoreSynchronization = true;
    jasmine.getEnv().addReporter(new ConsoleReporter());
  }
};

exports.appHost = 'http://localhost:3000';
