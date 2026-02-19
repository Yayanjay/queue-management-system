module.exports = {
  apps: [
    {
      name: "queue-system-backend",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // IMPORTANT: Set JWT_SECRET via environment variable on server
        // Example: JWT_SECRET=your-secret-key pm2 start ecosystem.config.js
        // Or create .env file on server (DO NOT commit .env to git)
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
