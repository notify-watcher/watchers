const {
  constants: { AUTH_TYPE_KEYS, TIMEFRAMES },
} = require('@notify-watcher/core');

const GITHUB_NOTIFICATIONS = {
  assign: {
    type: 'assign',
    description: 'You were assigned to the issue.',
  },
  author: {
    type: 'author',
    description: 'You created the thread.',
  },
  comment: {
    type: 'comment',
    description: 'You commented on the thread.',
  },
  invitation: {
    type: 'invitation',
    description: 'You accepted an invitation to contribute to the repository.',
  },
  manual: {
    type: 'manual',
    description: 'You subscribed to the thread (via an issue or pull request).',
  },
  mention: {
    type: 'mention',
    description: 'You were specifically @mentioned in the content.',
  },
  review_requested: {
    type: 'review_requested',
    description:
      "You, or a team you're a member of, were requested to review a pull request.",
  },
  security_alert: {
    type: 'security_alert',
    description:
      'GitHub discovered a security vulnerability in your repository.',
  },
  state_change: {
    type: 'state_change',
    description:
      'You changed the thread state (for example, closing an issue or merging a pull request).',
  },
  subscribed: {
    type: 'subscribed',
    description: "You're watching the repository.",
  },
  team_mention: {
    type: 'team_mention',
    description: 'You were on a team that was mentioned.',
  },
};

const config = {
  name: 'github-notifications',
  displayName: 'Github Notifications',
  description: 'Watcher for github notifications',
  auth: {
    token: {
      type: AUTH_TYPE_KEYS.string,
      description:
        "A Github personal access token token with access to notifications. To create one go to https://github.com/settings/tokens and create a new token with the 'notifications' scope.",
    },
  },
  libs: ['axios'],
  timeframe: {
    type: TIMEFRAMES.minute,
  },
  notificationTypes: {
    ...GITHUB_NOTIFICATIONS,
    newNotifications: {
      type: 'newNotifications',
      description: 'You have new notifications available.',
    },
  },
};

module.exports = config;
