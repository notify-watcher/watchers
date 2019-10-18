const {
  constants: { TIMEFRAMES },
} = require('@notify-watcher/core');

const GITHUB_NOTIFICATIONS = {
  assign: {
    key: 'assign',
    description: 'You were assigned to the issue.',
  },
  author: {
    key: 'author',
    description: 'You created the thread.',
  },
  comment: {
    key: 'comment',
    description: 'You commented on the thread.',
  },
  invitation: {
    key: 'invitation',
    description: 'You accepted an invitation to contribute to the repository.',
  },
  manual: {
    key: 'manual',
    description: 'You subscribed to the thread (via an issue or pull request).',
  },
  mention: {
    key: 'mention',
    description: 'You were specifically @mentioned in the content.',
  },
  review_requested: {
    key: 'review_requested',
    description:
      "You, or a team you're a member of, were requested to review a pull request.",
  },
  security_alert: {
    key: 'security_alert',
    description:
      'GitHub discovered a security vulnerability in your repository.',
  },
  state_change: {
    key: 'state_change',
    description:
      'You changed the thread state (for example, closing an issue or merging a pull request).',
  },
  subscribed: {
    key: 'subscribed',
    description: "You're watching the repository.",
  },
  team_mention: {
    key: 'team_mention',
    description: 'You were on a team that was mentioned.',
  },
};

const config = {
  name: 'github-notifications',
  displayName: 'Github Notifications',
  description: 'Watcher for github notifications',
  auth: true,
  libs: ['axios'],
  timeframe: {
    type: TIMEFRAMES.minute,
  },
  notificationTypes: {
    ...GITHUB_NOTIFICATIONS,
    newNotifications: {
      key: 'newNotifications',
      description: 'You have new notifications available.',
    },
  },
};

module.exports = config;
