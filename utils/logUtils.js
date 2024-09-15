const { Signale } = require('signale');

const options = {
  types: {
    model: {
      badge: '🤖',
      color: 'green',
      label: 'Model'
    },
    user: {
        badge: '👤',
        color: 'yellow',
        label: 'UserID'
    }
  }
};

const Logger = new Signale(options);

// Logger.success('Operation successful');
// Logger.info('This is an informational message');
// Logger.error('An error occurred');


module.exports = {Logger}
