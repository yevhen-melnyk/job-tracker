const PROXY_CONFIG = [
  {
    context: [
      "/jobs",
      "/progressHub"
    ],
    target: "https://localhost:7106",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
