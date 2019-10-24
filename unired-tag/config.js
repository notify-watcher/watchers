const {
  constants: { AUTH_TYPE_KEYS, TIMEFRAMES },
} = require('@notify-watcher/core');

const config = {
  name: 'unired-tag-total',
  displayName: 'Unired Tag Total',
  description: 'Watch your tag ballot using Unired',
  auth: {
    rut: {
      type: AUTH_TYPE_KEYS.string,
      description: 'Your RUT in the format 12345678-K (no points)',
    },
  },
  libs: ['puppeteer'],
  timeframe: {
    type: TIMEFRAMES.day,
    hour: 22,
  },
  notificationTypes: {
    updatedBallot: {
      key: 'updatedBallot',
      description: 'Your Tag ballot changed.',
    },
  },
};

module.exports = config;
