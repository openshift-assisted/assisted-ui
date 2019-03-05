//import { browser, ExpectedConditions as until } from 'protractor';
const browser = require('protractor').browser
const until = require('protractor').ExpectedConditions

const appHost = require('../protractor.conf').appHost
const mainView = require('../views/main.view')

const BROWSER_TIMEOUT = 15000;

describe('GUI layout', () => {

  afterAll(async() => {
    // Clears HTTP 401 errors for subsequent tests
    await browser.manage().logs().get('browser');
  });

  it('includes the Cluster Name field', async() => {
    await browser.get(appHost);
    expect(await browser.wait(until.visibilityOf(mainView.clusterName), BROWSER_TIMEOUT))
        .toBe(true);
  });

});
