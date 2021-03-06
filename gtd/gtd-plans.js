// GTD plans fetch

const URL = 'https://www.gtd.cl/ofertas/ofertas-gtd';

const productTypes = {
  internet: 'internet',
  phone: 'phone',
  television: 'television',
};

const internetPrefix = 'INTERNET FIBRA ÓPTICA';
const phonePrefix = 'TELEFONÍA Plan Minutos Libre';

function extractProductDetails(text) {
  if (text.startsWith(internetPrefix)) {
    // example: INTERNET FIBRA ÓPTICA 200 Mbps  60 Mbps Incluye Wifi HI Speed y 2 Smart Connect
    const parts = text
      .replace(internetPrefix, '')
      .trim()
      .split(' ');
    return {
      productType: productTypes.internet,
      megabytes: Number(parts[0]),
    };
  }
  if (text.startsWith(phonePrefix)) {
    // example: TELEFONÍA Plan Minutos Libre 100 Números.
    const parts = text
      .replace(phonePrefix, '')
      .trim()
      .split(' ');
    return {
      productType: productTypes.phone,
      numbers: Number(parts[0]),
    };
  }
  if (text.startsWith('TELEVISIÓN')) {
    // example: TELEVISIÓN 124 Canales Tv. Familia HD  Incluye Pack HD (36 Canales) Incluye 2 Decodificadores y Promo Fox Premium
    const regexp = /TELEVISIÓN ([1-9][0-9]+) Canales Tv\. [\w ]+\(([1-9][0-9]+) Canales\) [\w ]*/g;
    const matches = regexp.exec(text);
    return {
      productType: productTypes.television,
      channels: {
        normal: Number(matches[1]),
        hd: Number(matches[2]),
      },
    };
  }
  return undefined;
}

function extractProductPrice($, productElem) {
  const regexp = /[\w]*\$([1-9][0-9]+)[\w]*/g;
  const text = $(productElem)
    .text()
    .replace(/\./g, '');
  const matches = regexp.exec(text);
  return Number(matches[1]);
}

function extractProduct($, packContainer) {
  const { attribs } = $(packContainer)[0];
  if (attribs.style && !attribs.style.includes('visibility: visible')) {
    return undefined;
  }
  const name = $(packContainer)
    .find('h1')
    .text();
  const price = extractProductPrice($, packContainer);
  let details;
  const productElements = $(packContainer).find('.oferta-producto');
  if (productElements.length > 0) {
    details = productElements
      .map((i, productElement) =>
        $(productElement)
          .text()
          .trim(),
      )
      .map((i, productText) => extractProductDetails(productText));
  }
  return { name, price, details };
}

async function fetchPlans(axios, cheerio, lodash) {
  const response = await axios.get(URL);
  if (response.status !== 200) return undefined;
  const html = response.data;
  const $ = cheerio.load(html, {
    xml: {
      normalizeWhitespace: true,
    },
  });
  const packContainerIds = [
    'ofertas-tripack-container',
    'ofertas-duopack-container',
    'ofertas-planes-internet-container',
  ];
  return lodash.flatten(
    packContainerIds.map(packContainerId =>
      $(`#${packContainerId} > .col-md-12 > .row > .col-xs-12 > div`)
        .toArray()
        .map(packContainer => extractProduct($, packContainer)),
    ),
  );
}

// Comparison

function detailsItemEquals(detailsItemA, detailsItemB) {
  if (detailsItemA === undefined && detailsItemB === undefined) return true;
  if (detailsItemA === undefined || detailsItemB === undefined) return false;
  if (detailsItemA.productType !== detailsItemB.productType) return false;
  switch (detailsItemA.productType) {
    case productTypes.television:
      return (
        detailsItemA.channels.normal === detailsItemB.channels.normal &&
        detailsItemA.channels.hd === detailsItemB.channels.hd
      );
    case productTypes.phone:
      return detailsItemA.numbers === detailsItemB.numbers;
    case productTypes.internet:
      return detailsItemA.megabytes === detailsItemB.megabytes;
    default:
      return false;
  }
}

function detailsEquals(lodash, detailsA, detailsB) {
  if (detailsA.length !== detailsB.length) return false;
  const intersection = lodash.intersectionWith(
    detailsA,
    detailsB,
    detailsItemEquals,
  );
  return intersection.length === detailsA.length;
}

function planEquals(lodash, planA, planB) {
  if (planA.price !== planB.price) return false;
  return detailsEquals(lodash, planA.details, planB.details);
}

// Export

module.exports = {
  fetchPlans,
  planEquals,
};
