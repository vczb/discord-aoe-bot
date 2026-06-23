See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and commit guidelines.

## 🛠️ Phase 1: MVP & Core Infrastructure

- [x] Create `/player [player_id]` command to fetch profile data, Elo, and win rates from AoE2Insights.
- [x] Create `/lastmatch [player_id]` command using AoE2Insights/Official API to display a rich embed summary of the latest played game.
- [x] Create `/top10` command to show Top 10 Leaderboard
- [ ] Implement account linking via `/link [platform] [id]`.
      Multi-account handling: Users can run `/link` multiple times to bind different IDs.
      The bot will prompt the user to set one as "Primary" via Discord Button
      components or index them array-style for active commands.
- [x] Add in-memory cache layer (`node-cache`) to protect external API limits.
- [ ] Implement Relational Database layer (PostgreSQL DDL schema setup).
- [ ] Restructure codebase using Object-Oriented Programming (OOP) and Data Transfer Objects (DTOs) to sanitize API payloads before processing.
- [ ] Implement Discord Gateway Events (`guildCreate` / `guildDelete`) to handle automated server profile registration in the database.
- [ ] Implement `/leaderboard` command to generate a server-wide ranking based on the linked members in that specific guild.
<!-- * [ ] Create a channel-binding command (e.g., `/setup-leaderboard`) to designate a sticky text channel where the server leaderboard updates automatically every 24 hours. -->

---

## 🚀 Phase 2: Engagement & Game Intelligence

- [ ] Implement automated match feed processing via background workers (Push architecture).
- [ ] Implement tactical commands (e.g., `/counter [civ]`) consuming data points from `aoestats.io`.
- [ ] Build `/build [civilization]` command using a clean internal dataset to display static Build Order guides.
- [ ] Implement administrative Community Management tools (TBD—e.g., automated role assignment based on Elo thresholds like `@Elo 1400+`).

---

## 💎 Phase 3: SaaS Ecosystem & Live Tracking

- [ ] Add real-time Pro-Player tracking and active streaming alert systems.
- [ ] Implement payment gateway integrations (Stripe / Discord App Directory) to handle server premium caps.
