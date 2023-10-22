const PROXY_CONFIG = {
  "/jobs": {
    "target": "https://localhost:7106/jobs",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/progressHub": {
    "target": "https://localhost:7106",
    "secure": false,
    "changeOrigin": true,
    "ws": true,
    "logLevel": "debug"
  }
};

module.exports = PROXY_CONFIG;
