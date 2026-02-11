module.exports = {
  apps: [
    {
      name: "queue-system-app",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
