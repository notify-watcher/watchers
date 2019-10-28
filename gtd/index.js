const config = require('./config');
const { fetchPlans, planEquals } = require('./gtd-plans');

async function watch({ snapshot: previousSnapshot, libs }) {
  const { lodash, axios, cheerio } = libs;
  const snapshot = await fetchPlans(axios, cheerio, lodash);
  const newPlans = lodash.differenceWith(
    snapshot,
    previousSnapshot,
    (planA, planB) => planEquals(lodash, planA, planB),
  );
  const notifications = newPlans.map(newPlan => ({
    type: config.notificationTypes.newPlan.key,
    message: `GTD has a new plan: ${newPlan.name}`,
  }));
  return { snapshot, notifications };
}

module.exports = {
  config,
  watch,
};
