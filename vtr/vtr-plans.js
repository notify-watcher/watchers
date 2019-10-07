// VTR plans fetch

/*
  Example:
<li class="custom-bottom-margin-li">
    <i class="icon-television"></i>
    <small>televisión HD</small>
    <strong>82</strong> CANALES +
    <strong>70</strong> CANALES HD
    <a href="javascript:void(0);" onclick="getCanalesForPacks('prod3330090')" data-modal="modal-canales-for-packsPLP" class="block-mobile load-img-after-click">Ver Canales</a>
  </li>
*/
function extractTelevisionDetails(elemText) {
  const channels = elemText
    .replace("televisión HD", "")
    .replace("Ver Canales", "")
    .trim()
    .split("+");
  return {
    productType: "television",
    channels: {
      normal: Number(channels[0].replace("CANALES", "").trim()),
      hd: Number(channels[1].replace("CANALES HD", "").trim())
    }
  };
}

/*
  Example:
  <li class="new-product-wrap">
    <i class="icon-wifi"></i>
    <small>internet</small>
    <strong class="product-name"> MEGA 400</strong>
  </li>
*/
function extractInternetDetails(elemText) {
  const megabytes = elemText
    .replace("internet", "")
    .replace("MEGA", "")
    .trim();
  return {
    productType: "internet",
    megabytes: Number(megabytes)
  };
}

/*
  Example
  <li>
    <i class="icon">
      <img src="https://vtr.com/img/img-plp-ab/ico-tel-phone-white.svg">
     </i>
    <small>telefonía</small>
    <strong>ILIMITADO A FIJO</strong> + 600 MIN. A MÓVILES
  </li>
*/
function extractPhoneDetails(elemText) {
  const mobileMinutes = elemText
    .replace("telefonía ILIMITADO A FIJO +", "")
    .replace("MIN. A MÓVILES", "")
    .trim();
  return {
    productType: "phone",
    mobileMinutes: Number(mobileMinutes)
  };
}

function extractSingleProductDetails($, itemElem) {
  const $itemElem = $(itemElem);
  const text = $itemElem.text();
  if ($itemElem.find("i.icon-wifi").length > 0) {
    return extractInternetDetails(text);
  }
  if ($itemElem.find("i.icon-television").length > 0) {
    return extractTelevisionDetails(text);
  }
  if ($itemElem.find("small").text() === "telefonía") {
    return extractPhoneDetails(text);
  }
  return undefined;
}

function extractPlanDetails($, planElem) {
  const liElements = $(planElem).find(".terms-icon-list > li");
  return liElements
    .map((i, itemElem) => extractSingleProductDetails($, itemElem))
    .filter(item => item !== undefined);
}

function extractPlanPrice($, planElem) {
  const $planElement = $(planElem);
  let priceString = "";
  const smallNormalPrice = $planElement.find("small.margin-small-ab");
  if (
    smallNormalPrice &&
    // sometimes they hide deprecated or incorrect price tags this way
    !(
      smallNormalPrice[0].attribs.style &&
      smallNormalPrice[0].attribs.style.includes("visibility:hidden")
    )
  ) {
    priceString = smallNormalPrice
      .text()
      .replace("Normal:", "")
      .trim();
  } else {
    priceString = $planElement
      .find(".box-plp-price-ab > .price-plp > h5 > strong")
      .text()
      .trim();
  }
  return Number(priceString.replace("$", "").replace(".", ""));
}

function extractPlanName($, planElem) {
  const productName = $(planElem).find('.terms-icon-list > .new-product-wrap > .product-name').text().trim();
  const omProductName = $(planElem)
    .find("a.om-C2C")[0]
    .attribs["om-productname"].trim();
  return omProductName || productName;
}

function extractPlan($, productElem) {
  const name = extractPlanName($, productElem);
  const price = extractPlanPrice($, productElem);
  const details = extractPlanDetails($, productElem);
  return { name, price, details };
}

const URL =
  "https://vtr.com/productos/HogarPacks/triple-pack-banda-ancha-television-telefonia";

async function fetchPlans(axios, cheerio) {
  const response = await axios.get(URL);
  if (response.status !== 200) return undefined;
  const html = response.data;
  const $ = cheerio.load(html, {
    xml: {
      normalizeWhitespace: true
    }
  });
  const planElements = $(".vtr-plp.vtr-plp--ab .vtr-plp__body");
  return planElements.toArray().map(planElement => extractPlan($, planElement));
}

// Comparision

function detailsItemEquals(detailsItemA, detailsItemB) {
  if (detailsItemA === undefined && detailsItemB === undefined) return true;
  if (detailsItemA === undefined || detailsItemB === undefined) return false;
  if (detailsItemA.productType !== detailsItemB.productType) return false;
  // eslint-disable-next-line default-case
  switch (detailsItemA.productType) {
    case "television":
      return (
        detailsItemA.channels.normal === detailsItemB.channels.normal &&
        detailsItemA.channels.hd === detailsItemB.channels.hd
      );
    case "phone":
      return detailsItemA.mobileMinutes === detailsItemB.mobileMinutes;
    case "internet":
      return detailsItemA.megabytes === detailsItemB.megabytes;
  }
  return false;
}

function detailsEquals(lodash, detailsA, detailsB) {
  if (detailsA.length !== detailsB.length) return false;
  const intersection = lodash.intersectionWith(
    [detailsA, detailsB],
    detailsItemEquals
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
  planEquals
};
