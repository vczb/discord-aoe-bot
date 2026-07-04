export default {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "aoeii",
      password: "aoeii",
      database: "aoeii",
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
