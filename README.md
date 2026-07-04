See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and commit guidelines.

## 🛠️ Phase 1: MVP & Core Infrastructure

- [x] Create `/player [player_id]` command to fetch profile data, Elo, and win rates from AoE2Insights.
- [x] Create `/lastmatch [player_id]` command using AoE2Insights/Official API to display a rich embed summary of the latest played game.
- [x] Create `/top10` command to show Top 10 Leaderboard
- [ ] Implement `/link` command to link Discord members to a player
- [x] Add in-memory cache layer (`node-cache`) to protect external API limits.
- [x] Implement Relational Database layer (PostgreSQL DDL schema setup).
  - [x] Create guilds table
  - [ ] Create members table
  - [ ] Create players table
  - [ ] Create match table (table name TBD)
  - [ ] Create correct relationships
  <!-- - [ ] Restructure codebase using Object-Oriented Programming (OOP) and Data Transfer Objects (DTOs) to sanitize API payloads before processing. -->

- [x] Implement Discord Gateway Events (`guildCreate` / `guildDelete`) to handle automated server profile registration in the database.
- [ ] Implement `/leaderboard` command to generate a server-wide ranking based on the linked members in that specific guild.
<!-- * [ ] Create a channel-binding command (e.g., `/setup-leaderboard`) to designate a sticky text channel where the server leaderboard updates automatically every 24 hours. -->

---

## 🚀 Phase 2: Engagement & Game Intelligence

- [ ] Implement automated match feed processing via background workers (Push architecture).
- [ ] Implement tactical commands (e.g., `/counter [civ]`)
- [ ] Implement tactical commands (e.g., `/hint [civ]`)
- [ ] Build `/build [choice: {fast castle, MA rush, Archer}]` command using a clean internal dataset to display static Build Order guides.
- [ ] Implement administrative Community Management tools (TBD—e.g., automated role assignment based on Elo thresholds like `@Elo 1400+`).
- [ ] Build a tool for organizing tournaments with members

---

## 💎 Phase 3: SaaS Ecosystem & Live Tracking

- [ ] Add real-time Pro-Player tracking and active streaming alert systems.
- [ ] Implement payment gateway integrations (Stripe / Discord App Directory) to handle server premium caps.
