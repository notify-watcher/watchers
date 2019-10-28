const config = require('./config');
const { fetchPlans, planEquals } = require('./vtr-plans');

async function watch({ snapshot: previousSnapshot, libs }) {
  const { lodash, axios, cheerio } = libs;
  let snapshot;
  try {
    snapshot = await fetchPlans(axios, cheerio);
  } catch (error) {
    if (error.response) throw error.response;
    throw error;
  }

  const newPlans = lodash.differenceWith(
    snapshot,
    previousSnapshot,
    (planA, planB) => planEquals(lodash, planA, planB),
  );
  const notifications = newPlans.map(newPlan => ({
    type: config.notificationTypes.newPlan.key,
    message: `VTR has a new plan: ${newPlan.name}`,
  }));
  return { snapshot, notifications };
}

module.exports = {
  config,
  watch,
};
