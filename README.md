# AoE2 Discord Bot

### Phase 1

- [x] Create `/player [player]` command to fetch player Elo, win rates, and stats from AoE2Insights
- [ ] Create `/lastmatch [player]` command to display a rich embed summary of the latest played game
- [ ] Build `/build [civilization]` command to display clean, static Build Order guides inside embed messages

### Phase 2

- [ ] Implement Discord account linking via `/vincular [Steam/Xbox]` to automate server nickname synchronization
- [ ] Implement game intelligence commands (e.g., /counter [civ], /build [strat])

### Phase 3

- [ ] Add Real-time Pro-Player / Streamer status alerts

## oficial API

https://api.ageofempires.com/api/v2/ageii/Leaderboard

## other API:

https://aoestats.io/api-info/
https://www.aoe2insights.com/user/12182910/civ-stats/
https://www.aoe2insights.com/user/12182910/elo-history/3/

---

```
curl -X POST 'https://api.ageofempires.com/api/GameStats/AgeII/GetMatchList' \
  -H 'Content-Type: application/json' \
  -d '{
    "gamertag": "unknown user",
    "playerNumber": 0,
    "game": "age2",
    "profileId": 14714809,
    "sortColumn": "dateTime",
    "sortDirection": "DESC",
    "page": 1,
    "recordCount": 10,
    "matchType": "3"
  }'

```
