const config = require('./config');

const GITHUB_AUTH_URL = 'https://api.github.com/user';
const GITHUB_NOTIFICATIONS_URL = 'https://api.github.com/notifications';
const NOTIFICATION_URL_ID_REGEX = /.+\/(\d+)/;

function apiUrlToHtmlUrl(url) {
  return url.replace(/api\./, '').replace(/repos\//, '');
}

function authHeader(token) {
  return {
    Authorization: `bearer ${token}`,
  };
}

async function checkAuth({ auth: { token }, libs: { axios } }) {
  try {
    await axios.get(GITHUB_AUTH_URL, {
      headers: { ...authHeader(token) },
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function watch({ snapshot, auth: { token }, libs: { axios } }) {
  const { ifModifiedSince = '' } = snapshot;
  let response;

  try {
    response = await axios.get(GITHUB_NOTIFICATIONS_URL, {
      headers: {
        ...authHeader(token),
        'If-Modified-Since': ifModifiedSince,
      },
    });
  } catch (error) {
    const { response: { status } = {} } = error;
    if (status === 304) {
      // No new notifications
      return {
        snapshot,
        notifications: [],
      };
    }

    throw error.response;
  }

  const { data, headers } = response;
  const notifications = [];

  if (data.length > 0) {
    notifications.push({
      type: config.notificationTypes.newNotifications.key,
      message: `You have ${data.length} new notifications`,
    });
  }

  data.forEach(notification => {
    const {
      reason,
      subject: { title, url, latest_comment_url: latestCommentUrl, type },
      repository: { full_name: fullName },
    } = notification;
    // If it's not a recognized notification we'll ignore it
    if (!config.notificationTypes[reason]) return;

    const updatedOrCreatedMessage = url !== latestCommentUrl ? '' : 'comment';
    const id = url.match(NOTIFICATION_URL_ID_REGEX)[1];
    const idText = id ? `#${id}` : '';
    notifications.push({
      type: config.notificationTypes[reason].key,
      message: `${fullName}${idText} ${title} - ${type} ${updatedOrCreatedMessage}`,
      metadata: {
        url: latestCommentUrl
          ? apiUrlToHtmlUrl(latestCommentUrl)
          : apiUrlToHtmlUrl(url),
        repository: fullName,
      },
    });
  });

  return {
    snapshot: {
      ifModifiedSince: headers['last-modified'],
    },
    notifications,
  };
}

module.exports = {
  config,
  checkAuth,
  watch,
};
