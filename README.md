# AoE2 Discord Bot

### Phase 1

- [ ] Create `/perfil [player]` command to fetch player Elo, win rates, and stats from AoE2Insights
- [ ] Create `/lastmatch [player]` command to display a rich embed summary of the latest played game
- [ ] Build `/build [civilization]` command to display clean, static Build Order guides inside embed messages

### Phase 2

- [ ] Implement Discord account linking via `/vincular [Steam/Xbox]` to automate server nickname synchronization
- [ ] Implement game intelligence commands (e.g., /counter [civ], /build [strat])

### Phase 3

- [ ] Add Real-time Pro-Player / Streamer status alerts

## API doc:

https://api.ageofempires.com/api/v2/ageii/Leaderboard
https://aoestats.io/api-info/
https://www.aoe2insights.com/user/12182910/civ-stats/
https://www.aoe2insights.com/user/12182910/elo-history/3/

## oficial API

curl 'https://api.ageofempires.com/api/v2/ageii/Leaderboard' \
 --compressed \
 -X POST \
 -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86*64; rv:151.0) Gecko/20100101 Firefox/151.0' \
 -H 'Accept: */\_' \
 -H 'Accept-Language: en-US,en;q=0.9' \
 -H 'Accept-Encoding: gzip, deflate, br, zstd' \
 -H 'Referer: https://www.ageofempires.com/' \
 -H 'Content-Type: application/json' \
 -H 'Origin: https://www.ageofempires.com' \
 -H 'DNT: 1' \
 -H 'Sec-GPC: 1' \
 -H 'Connection: keep-alive' \
 -H 'Cookie: MSCC=cid=m1virkohv8xicgtlnjicgmy6-c1=2-c2=2-c3=2; .AgeOfEmpiresServices=CfDJ8KQGbXRLpjZIpHfYcCqYDyl0Q_1-sswHLAK8a0FHwbhsLi3oACr6dIglz7V8dtifN8_PyV5pm3BoRcjZQVrSNV6WDjT6K8UQ3p8vdm4ffC6ELKecaCxYcjWAHkK4a-ESkxXWH_ZNf0UcBqd90G0FzdOLaWbbgWrSOE42kXqaK4kglIWVguHbHcZmAxlCt3OzRrpp1XCf51pVU-vogfFcEj5U11Z1tlShcUVenFokYz-nY5dd4FwcAuNJMUKRRU6WE2gGfNdUlk3Qu3tDp_AJkzggwv7pndF3CbakM57-99mQbJtufFuAITCdeD23G2NFst4CbA3T_N-Jh7jPecrw4psMNhfuy93GlOduUDUVqsQDgwhTPS6QVoqueZMw7ahI2\_\_TsNJardI4-eME4thfrybJEuIurGDPwEYNxvNtZjstd3QXRybCJLLMVq-T-r6UgMssajaaTviFJ9mcAgbqCoAh6JN27g4Yw5EjnsMD8BCOpMmB7a_yuHik2Iitg8E58F1HUHzoAf6atWdSu7xZijloH-Qi1aUAEh1WYJN1lFvdxxHwzenwTRhpti-e2fqrmpFuSrS3-htDlg86T5x2QB9NZyW03YmJCJlZsLpZrzWpdiDwrryDwP9RyRSDVbqc9tcLlHvSFn-Jmzh3ZmGodnz4FT068AeqNNxR1CaKN3ZKKfPATmVIOKpQntgfrwvrCK-RK7q4gIRNYWg42OnCX7vBCVhTJ6y5Xo6FgwwiC25c-EBDgmsc0Ib9Cy19-BgnqfLy-dQyyxSmZtBMvkVsSi691thlkDxdxukGgtsKZKXMGaUYm-4V2rKEEJNZB1lFLoZLcUcj9kG0qhJv2WReqh6hm7SoSyzDFgHQMkjUQ7lVbNH2YVedP4gPu1NfNE0bESlli8X9I6I7Gv807WfPM8RtuR4wPbponf5bP_BLviqSBKLaBZp2MO0E2CuBS4VtN5j4sDbhYNXGpJbgGZMldH8miGYF8wvBJAeY5K3YsVHW; age-user=true; wordpress_logged_in_057b6aced21211647bf373b0d3798e5f=2db7e5ed21f81df34c0c867f07e637ffebe8de1633f759ed83%7C1781990660%7Cz6byxcOCD5yo6FlDsifp8BOJVzuNGLGtMcKgfs4olYV%7Ca37da274eeb8d761e76982476ce4c9e99f77f2c5387d95540fd5c112880e788f; age_login_expire=1' \
 -H 'Sec-Fetch-Dest: empty' \
 -H 'Sec-Fetch-Mode: cors' \
 -H 'Sec-Fetch-Site: same-site' \
 --data-raw '{"region":"7","matchType":"3","consoleMatchType":15,"searchPlayer":"Malabytes","page":1,"count":100,"sortColumn":"rank","sortDirection":"ASC"}'

curl -X POST "https://api.ageofempires.com/api/v2/ageii/Leaderboard" \
 -H "Content-Type: application/json" \
 -d '{
"region":"7",
"matchType":"3",
"searchPlayer": "Malabytes",
"count": 100,
"sortColumn": "rank",
"sortDirection": "ASC"
}'
