## Running the project

```bash
npm run build    # compile TypeScript
npm run dev      # run in dev mode with hot reload
npm start        # build and run the bot
```

For local development, expose your server with [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Copy the generated `https://<id>.ngrok.io` URL and set it as the **Interactions Endpoint URL** in the [Discord application settings](https://discord.com/developers/applications/1516912180048560268/information).

## Publishing commands to Discord

After adding or modifying slash commands, you must register them with Discord:

```bash
npm run register
```

## Commit style

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

| Prefix       | Usage                                              |
|--------------|----------------------------------------------------|
| `feat:`      | new feature visible to users                       |
| `fix:`       | bug fix                                            |
| `refactor:`  | internal code changes without behavioral change    |
| `docs:`      | documentation only (README, CONTRIBUTING, etc.)    |
| `chore:`     | maintenance, tooling, dependencies                 |

If a commit adds a feature and includes refactoring, use `feat:`. For pure code cleanup with no new functionality, prefer `refactor:`.
