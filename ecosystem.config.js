require("dotenv").config({ path: ".env.deploy" });

const {
  // общие
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REF,
  NPM_PATH,

  // backend
  DEPLOY_REPO,
  DEPLOY_PATH_BACKEND,

  // frontend
  DEPLOY_PATH_FRONTEND,
} = process.env;

module.exports = {
  apps: [
    {
      name: "api-service",
      script: "./dist/app.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
    // {
    //   name: "frontend",
    //   script: "npx serve build", // или другой сервер, если ты используешь `serve`
    //   cwd: DEPLOY_PATH_FRONTEND,
    //   env_production: {
    //     NODE_ENV: "production",
    //   },
    // },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH_BACKEND,

      "pre-deploy-local": `scp ./.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_BACKEND}/shared/.env`,

      "post-deploy": `
      export ${NPM_PATH} &&
      cd ${DEPLOY_PATH_BACKEND}/current &&
      npm install &&
      npm run build &&
      pm2 reload ecosystem.config.js --only api-service --env production
    `,
    },

    frontend: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: "ignore",
      repo: "noop",
      path: DEPLOY_PATH_FRONTEND,
      "pre-setup": "echo 'skip setup'",
      "post-setup": "echo 'skip post-setup'",
      "pre-deploy": "echo 'skip pre-deploy'",
      "post-deploy": `export ${NPM_PATH} && cd ${DEPLOY_PATH_BACKEND}/current && npm install && npm run build && pm2 reload ecosystem.config.js --only api-service --env production
`,
    },
  },
};
