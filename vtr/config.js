const {
  constants: { TIMEFRAMES },
} = require('@notify-watcher/core');

module.exports = {
  name: 'vtr',
  displayName: 'VTR',
  description: 'VTR plans watcher',
  auth: false,
  libs: ['axios', 'cheerio', 'lodash'],
  timeframe: {
    type: TIMEFRAMES.day,
    hour: 10,
  },
  notificationTypes: {
    newPlan: {
      key: 'newPlan',
      description: 'When a new plan is found',
    },
  },
};
