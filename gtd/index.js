const config = require("./config.json");
const { fetchPlans, planEquals } = require("./gtd-plans");

async function watch({ snapshot: previousSnapshot, libs }) {
  const { _, axios, cheerio } = libs;
  let snapshot;
  try {
    snapshot = await fetchPlans(axios, cheerio, _);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("vtr error:", error);
    // TODO: Notify server of the error
    return {
      snapshot,
      notifications: [],
      error
    };
  }
  const newPlans = _.differenceWith(
    snapshot,
    previousSnapshot,
    (planA, planB) => planEquals(_, planA, planB)
  );
  const notifications = newPlans.map(newPlan => ({
    key: config.notificationTypes.newPlan.key,
    message: `GTD has a new plan: ${newPlan.name}`
  }));
  return { snapshot, notifications };
}

module.exports = {
  config,
  watch
};
