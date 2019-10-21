/* eslint-disable no-console */
const { Executor } = require('@notify-watcher/executor');
const githubNotificationsWatcher = require('./github-notifications');
const vtrPlansWatcher = require('./vtr');
const gtdPlansWatcher = require('./gtd');

const executor = new Executor();

// eslint-disable-next-line no-unused-vars
async function checkAuthGithubNotifications() {
  const authOk = await executor.run(githubNotificationsWatcher.checkAuth, {
    auth: { token: process.env.GITHUB_NOTIFICATIONS_TOKEN },
  });
  console.log('authOk:', authOk);
}

// eslint-disable-next-line no-unused-vars
async function watchGithubNotifications() {
  const { snapshot, notifications, error = {} } = await executor.run(
    githubNotificationsWatcher.watch,
    {
      snapshot: {
        // ifModifiedSince: "Fri, 04 Oct 2019 21:45:01 GMT"
      },
      auth: { token: process.env.GITHUB_NOTIFICATIONS_TOKEN },
    },
  );
  console.log('new snapshot:', snapshot);
  console.log('notifications:', notifications);
  console.log('error.key:', error.key);
}

// eslint-disable-next-line no-unused-vars
async function watchVtrPlans() {
  const { snapshot, notifications, error = {} } = await executor.run(
    vtrPlansWatcher.watch,
    {
      snapshot: {},
    },
  );
  console.log('new snapshot:', snapshot);
  console.log('notifications:', notifications);
  console.log('error.key:', error.key);
}

// eslint-disable-next-line no-unused-vars
async function watchGtdPlans() {
  const { snapshot, notifications, error = {} } = await executor.run(
    gtdPlansWatcher.watch,
    {
      snapshot: {},
    },
  );
  console.log('new snapshot:', snapshot);
  console.log('notifications:', notifications);
  console.log('error.key:', error.key);
}

[
  /* 
    Add other watchWatcher here to develop
    Comment to avoid calling
  */
  // checkAuthGithubNotifications,
  // watchGithubNotifications,
  // watchVtrPlans,
  // watchGtdPlans,
].forEach(watch => watch());
