/* eslint-disable no-console */
const util = require('util');
const { Executor } = require('@notify-watcher/executor');
const githubNotificationsWatcher = require('./github-notifications');
const gtdPlansWatcher = require('./gtd');
const uniredTagWatcher = require('./unired-tag');
const vtrPlansWatcher = require('./vtr');

const executor = new Executor();

async function checkAuth(watcher, auth) {
  const authOk = await executor.run(watcher.checkAuth, { auth });
  console.log(`# ${watcher.config.name} auth ${authOk}`);
}

async function runWatcher(watcher, snapshot, auth = {}) {
  let data;
  try {
    data = await executor.run(watcher.watch, { snapshot, auth });
  } catch (error) {
    console.error(`# ${watcher.config.name} error\n${error}`);
  }

  const { snapshot: newSnapshot, notifications } = data;
  const logData = {
    previousSnapshot: snapshot,
    newSnapshot,
    notifications,
  };
  console.log(`# ${watcher.config.name}`);
  console.log(util.inspect(logData, { showHidden: false, depth: 2 }));
  return data;
}

async function runWatcherTwice(watcher, auth = {}) {
  const data = await runWatcher(watcher, {}, auth);
  await runWatcher(watcher, data.snapshot, auth);
}

// eslint-disable-next-line no-unused-vars
async function checkAuthGithubNotifications() {
  await checkAuth(githubNotificationsWatcher, {
    token: process.env.GITHUB_NOTIFICATIONS_TOKEN,
  });
}

// eslint-disable-next-line no-unused-vars
async function watchGithubNotifications() {
  await runWatcherTwice('github-notifications', githubNotificationsWatcher, {
    token: process.env.GITHUB_NOTIFICATIONS_TOKEN,
  });
}

// eslint-disable-next-line no-unused-vars
async function watchUniredTag() {
  await runWatcherTwice('unired-tag', uniredTagWatcher, {
    rut: process.env.rut,
  });
}

Promise.all([
  /* 
    Add other watchWatcher here to develop
    Comment to avoid calling
  */
  checkAuthGithubNotifications(),
  watchGithubNotifications(),
  runWatcherTwice(vtrPlansWatcher),
  runWatcherTwice(gtdPlansWatcher),
]);
