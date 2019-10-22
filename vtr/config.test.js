const {
  validators: { validateAuth, validateTimeframe },
} = require('@notify-watcher/core');
const config = require('./config');

function validate(validation, item) {
  return validation(item, config.name, { verbose: true });
}

describe('configuration', () => {
  it('has valid auth', () => {
    expect(validate(validateAuth, config.auth)).toBeTruthy();
  });

  it('has valid timeframe', () => {
    expect(validate(validateTimeframe, config.timeframe)).toBeTruthy();
  });
});
