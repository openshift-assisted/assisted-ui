import { browser, ExpectedConditions as until } from 'protractor';

import { appHost } from '../protractor.conf';
import { clusterName } from '../views/main.view';

const BROWSER_TIMEOUT = 15000;

describe('GUI layout', () => {
  afterAll(async () => {
    // Clears HTTP 401 errors for subsequent tests
    await browser
      .manage()
      .logs()
      .get('browser');
  });

  it('includes the Cluster Name field', async () => {
    await browser.get(appHost);
    expect(
      await browser.wait(until.visibilityOf(clusterName), BROWSER_TIMEOUT)
    ).toBe(true);
  });
});
