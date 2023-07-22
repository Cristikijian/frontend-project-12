const rollbarConfig = {
  accessToken: process.env.ROLLBAR_TOKEN,
  payload: {
    environment: 'production',
  },
  captureUncaught: true,
  captureUnhandledRejections: true,
};

export default rollbarConfig;
