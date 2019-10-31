const {
  constants: { TIMEFRAMES },
} = require('@notify-watcher/core');

module.exports = {
  name: 'gtd',
  displayName: 'GTD',
  description: 'GTD Manquehue plans watcher',
  auth: false,
  libs: ['axios', 'cheerio', 'lodash'],
  timeframe: {
    type: TIMEFRAMES.day,
    hour: 10,
  },
  notificationTypes: {
    newPlan: {
      type: 'newPlan',
      description: 'When a new plan is found',
    },
  },
};
