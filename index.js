/* eslint-disable no-console */
const { execute } = require('@notify-watcher/core');
const exampleWatcher = require('./example-watcher');
const githubNotificationsWatcher = require('./github-notifications');
const vtrPlansWatcher = require('./vtr');
const gtdPlansWatcher = require('./gtd');

// eslint-disable-next-line no-unused-vars
async function watchExample() {
  const { snapshot, notifications } = await execute(exampleWatcher.watch, {
    snapshot: { a: 1 },
  });
  console.log('new snapshot:', snapshot);
  console.log('notifications:', notifications);
}

// eslint-disable-next-line no-unused-vars
async function checkAuthGithubNotifications() {
  const authOk = await execute(githubNotificationsWatcher.checkAuth, {
    auth: { token: process.env.GITHUB_NOTIFICATIONS_TOKEN },
  });
  console.log('authOk:', authOk);
}

// eslint-disable-next-line no-unused-vars
async function watchGithubNotifications() {
  const { snapshot, notifications } = await execute(
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
}

// eslint-disable-next-line no-unused-vars
async function watchVtrPlans() {
  const { snapshot, notifications } = await execute(vtrPlansWatcher.watch, {
    snapshot: {},
  });
  console.log('new snapshot:', snapshot);
  console.log('notifications:', notifications);
}

// eslint-disable-next-line no-unused-vars
async function watchGtdPlans() {
  const { snapshot, notifications } = await execute(gtdPlansWatcher.watch, {
    snapshot: {},
  });
  console.log('new snapshot:', snapshot);
  console.log('notifications:', notifications);
}

[
  /* 
    Add other watchWatcher here to develop
    Comment to avoid calling
  */
  // watchExample,
  // checkAuthGithubNotifications,
  // watchGithubNotifications,
  // watchVtrPlans,
  // watchGtdPlans,
].forEach(watch => watch());
