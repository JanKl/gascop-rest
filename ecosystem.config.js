module.exports = {
  apps : [{
    name: 'gascop-rest',
    script: './build/bin/www',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 1234
    }
  }]
};
