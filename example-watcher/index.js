const { notificationTypes } = require("./index.json");

async function watch({ snapshot, libs }) {
  const notifications = [];

  // you can use libs to obtain and parse info
  // eslint-disable-next-line no-console
  console.log("Available libs:", Object.keys(libs));

  // compare with latestData to generate notifications
  const newData = {
    a: 2
  };

  if (snapshot.a !== newData.a) {
    notifications.push({
      key: notificationTypes.newValue.key,
      message: `a has a new value: ${newData.a}`
    });
  }

  // Return new snapshot and notifications to be sent
  return { snapshot: newData, notifications };
}

module.exports = watch;
