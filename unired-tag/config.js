const {
  constants: { TIMEFRAMES },
} = require('@notify-watcher/core');

const config = {
  name: 'unired-tag-total',
  displayName: 'Unired Tag Total',
  description: 'Watch your tag ballot using Unired',
  auth: true,
  libs: ['puppeteer'],
  timeframe: {
    type: TIMEFRAMES.minute,
  },
  notificationTypes: {
    updatedBallot: {
      key: 'updatedBallot',
      description: 'Your Tag ballot changed.',
    },
  },
};

module.exports = config;
