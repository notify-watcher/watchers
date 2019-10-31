const config = require('./config');

const UNIRED_URL = 'https://www.unired.cl';

async function waitAndClick(page, selector) {
  await page.waitForSelector(selector);
  await page.click(selector);
}

async function watch({ auth: { rut }, libs: { puppeteer }, snapshot }) {
  const browser = await puppeteer.launch({
    // headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

  await waitAndClick(page, '#IdEmpresaRubro_autocomplete');
  await page.keyboard.type('Tag Total');
  await waitAndClick(page, '.ui-corner-all');
  await waitAndClick(page, '#express_continuar');

  await waitAndClick(page, '#ValorIdentificador');
  await page.keyboard.type(rut);
  await waitAndClick(page, '#express_agregar_cuenta_aceptar');

  await Promise.all([
    page.waitForNavigation({
      waitUntil: 'networkidle0',
    }),
    waitAndClick(page, '#express_pagar'),
  ]);

  const span = await page.$('#TotalPagar');
  const text = await page.evaluate(element => element.textContent, span);
  const ballot = text.replace('Total a pagar: $', '').trim();

  const notifications = [];
  if (ballot !== snapshot.ballot) {
    notifications.push({
      type: config.notificationTypes.updatedBallot.type,
      message: `Your tag ballot is ${ballot}`,
    });
  }

  browser.close();

  return {
    snapshot: { ballot },
    notifications,
  };
}

module.exports = {
  config,
  watch,
};
