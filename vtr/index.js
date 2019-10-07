const { notificationTypes } = require("./index.json");
const { fetchPlans, planEquals } = require("./vtr-plans");

async function watch({ snapshot: previousSnapshot, libs }) {
  const { _, axios, cheerio } = libs;
  const snapshot = await fetchPlans(axios, cheerio);
  const newPlans = _.differenceWith(
    snapshot,
    previousSnapshot,
    (planA, planB) => planEquals(_, planA, planB)
  );
  const notifications = newPlans.map(newPlan => ({
    key: notificationTypes.newPlan.key,
    message: `VTR has a new plan: ${newPlan.name}`,
  }));
  return { snapshot, notifications };
}

module.exports = watch;
