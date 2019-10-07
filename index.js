/* eslint-disable no-console */
const { execute } = require("@notify-watcher/core");
const exampleWatcher = require("./example-watcher");

async function executeExampleWatcher() {
  const { snapshot, notifications } = await execute(exampleWatcher, {
    snapshot: {
      a: 1
    }
  });
  console.log("new snapshot:", snapshot);
  console.log("notifications:", notifications);
}

executeExampleWatcher();
