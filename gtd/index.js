const { notificationTypes } = require('./index.json');
const {
  fetchPlans,
  planEquals,
} = require('./gtd-plans');

async function watch({ latestData, updateData, submitNotifications, libs }) {
  const { lodash, axios, cheerio } = libs;
  const recentData = await fetchPlans(axios, cheerio, lodash);
  const newPlans = lodash.differenceWith(recentData, latestData, (planA, planB) => planEquals(lodash, planA, planB));
  const notifications = newPlans.map(newPlan => ({
    key: notificationTypes.newPlan.key,
    message: `GTD has a new plan: ${newPlan.name}`,
  }));
  updateData(recentData);
  submitNotifications(notifications);
}

module.exports = watch;
