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

async function waitAndClick(page, selector) {
  await page.waitForSelector(selector);
  await page.click(selector);
}

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
    await page.click('#irAUnired').catch(() => {});

    await waitAndClick(page, '#IdEmpresaRubro_autocomplete');
    await page.keyboard.type('Tag Total');
    await waitAndClick(page, '.ui-corner-all');
    await waitAndClick(page, '#express_continuar');

    await waitAndClick(page, '#ValorIdentificador');
    await page.keyboard.type(rut);
    await waitAndClick(page, '#express_agregar_cuenta_aceptar');

    // await page.waitForSelector('#express_pagar');
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
      }),
      waitAndClick(page, '#express_pagar'),
    ]);

    const span = await page.$('#TotalPagar');
    const text = await page.evaluate(element => element.textContent, span);
    await browser.close();
    const ballot = text.replace('Total a pagar: $', '').trim();

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
