/* eslint-disable no-console */
const { execute } = require("@notify-watcher/core");
const watcher = require("./example-watcher");

execute(watcher, {
  latestData: {
    a: 1
  },
  updateData: newData => console.log("newData", newData),
  submitNotifications: notifications =>
    console.log("notifications", notifications)
});
