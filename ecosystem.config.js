module.exports = {
    apps: [
      {
        name: "graphql-app",
        script: "index.js",
        instances: "max", // Use all available CPU cores
        exec_mode: "cluster", // Enable cluster mode for load balancing
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  