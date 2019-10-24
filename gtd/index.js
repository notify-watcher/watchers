const config = require('./config');
const { fetchPlans, planEquals } = require('./gtd-plans');

async function watch({ snapshot: previousSnapshot, libs }) {
  const { lodash, axios, cheerio } = libs;
  let snapshot;
  try {
    snapshot = await fetchPlans(axios, cheerio, lodash);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('gtd error:', error);
    // TODO: Notify server of the error
    return {
      snapshot,
      notifications: [],
      error,
    };
  }
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
