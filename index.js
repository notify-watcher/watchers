/* eslint-disable no-console */
const { execute } = require("@notify-watcher/core");
const watcher = require("./example-watcher");

async function tryWatcher() {
  const { snapshot, notifications } = await execute(watcher, {
    snapshot: {
      a: 1
    }
  })
  console.log("new snapshot:", snapshot)
  console.log("notifications:", notifications)
}

tryWatcher()
