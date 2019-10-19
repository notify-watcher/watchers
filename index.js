/* eslint-disable no-console */
const util = require('util');
const { Executor } = require('@notify-watcher/executor');
const githubNotificationsWatcher = require('./github-notifications');
const gtdPlansWatcher = require('./gtd');
const uniredTag = require('./unired-tag');
const vtrPlansWatcher = require('./vtr');

const executor = new Executor();

function log(data) {
  const { error, ...otherData } = data;
  const errorKey = error && error.key;
  console.log(
    util.inspect(
      { ...otherData, errorKey, error },
      { showHidden: false, depth: 2 },
    ),
  );
}

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

// eslint-disable-next-line no-unused-vars
async function watchUniredTag() {
  const data1 = await executor.run(uniredTag.watch, {
    snapshot: {},
    auth: { rut: process.env.RUT },
  });
  log({
    previousSnapshot: {},
    newSnapshot: data1.snapshot,
    notifications: data1.notifications,
    error: data1.error,
  });

  const data2 = await executor.run(uniredTag.watch, {
    snapshot: data1.snapshot,
    auth: { rut: process.env.RUT },
  });
  log({
    previousSnapshot: data1.snapshot,
    newSnapshot: data2.snapshot,
    notifications: data2.notifications,
    error: data2.error,
  });
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
  watchUniredTag,
].forEach(watch => watch());
