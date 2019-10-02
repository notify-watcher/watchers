const { notificationTypes } = require("./index.json");

async function watch({ latestData, updateData, submitNotifications, libs }) {
  const notifications = [];

  // you can use libs to obtain and parse info
  // eslint-disable-next-line no-console
  console.log("Available libs:", Object.keys(libs));

  // compare with latestData to generate notifications
  const newData = {
    a: 2
  };

  if (latestData.a !== newData.a) {
    notifications.push({
      key: notificationTypes.newValue.key,
      message: `a has a new value: ${newData.a}`
    });
  }

  // save new data with updateData for next watch
  updateData(newData);

  // submit notifications
  submitNotifications(notifications);
}

module.exports = watch;
