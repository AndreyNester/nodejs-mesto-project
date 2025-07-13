// ecosystem.config.js
require("dotenv").config();

const {
  MONGO_URI,
  JWT_SECRET,
  PORT = 3000,
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REF,
  DEPLOY_PATH,
  DEPLOY_REPO,
} = process.env;

module.exports = {
  apps: [
    {
      name: "api-service",
      script: "./dist/app.js",
      env_production: {
        NODE_ENV: "production",
        MONGO_URI,
        JWT_SECRET,
        PORT,
      },
      env_development: {
        NODE_ENV: "development",
        MONGO_URI,
        JWT_SECRET,
        PORT,
      },
    },
  ],

  // Настройка деплоя
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      "pre-deploy": `scp ./*.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      "post-deploy": "npm i && npm run build",
    },
  },
};
