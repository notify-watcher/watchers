const {
  constants: { ERRORS, TIMEFRAMES },
} = require('@notify-watcher/core');

const UNIRED_URL = 'https://www.unired.cl';

const config = {
  name: 'unired-tag-total',
  displayName: 'Unired Tag Total',
  description: 'Watch your tag ballot using Unired',
  auth: true,
  libs: ['puppeteer'],
  timeframe: {
    type: TIMEFRAMES.minute,
  },
  notificationTypes: {
    updatedBallot: {
      key: 'updatedBallot',
      description: 'Your Tag ballot changed.',
    },
  },
};

async function watch({ auth: { rut }, libs: { puppeteer }, snapshot }) {
  try {
    const browser = await puppeteer.launch({
      // headless: false,
      defaultViewport: {
        width: 1520,
        height: 1520,
      },
    });
    const page = await browser.newPage();
    await page.goto(UNIRED_URL);

    // this popup hides the buttons, but maybe they'll remove it
    // and this watcher shouldn't fail because it doesn't find it
    await page.click('#irAUnired').catch(() => { });

    await page.click('#IdEmpresaRubro_autocomplete');
    await page.keyboard.type('Tag Total');
    await page.waitForSelector('.ui-corner-all');
    await page.click('.ui-corner-all');
    await page.click('#express_continuar');

    await page.waitForSelector('#ValorIdentificador');
    await page.click('#ValorIdentificador');
    await page.keyboard.type(rut);
    await page.click('#express_agregar_cuenta_aceptar');

    await page.waitForSelector('#express_pagar');
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
      }),
      page.click('#express_pagar'),
    ]);

    const span = await page.$('#TotalPagar');
    const text = await page.evaluate(element => element.textContent, span);
    await browser.close();
    const ballot = text.replace('Total a pagar: $ ', '');

    const notifications = [];
    if (ballot !== snapshot.ballot) {
      notifications.push({
        type: config.notificationTypes.updatedBallot.key,
        message: `Your tag ballot is ${ballot}`,
      });
    }

    return {
      snapshot: { ballot },
      notifications,
    };
  } catch (error) {
    error.key = ERRORS.other;
    return {
      snapshot,
      notifications: [],
      error,
    };
  }
}

module.exports = {
  config,
  watch,
};
