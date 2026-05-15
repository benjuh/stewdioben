#!/usr/bin/env python3
"""
Fix players.json: include all career teams (not just post-2000) for players
who played at least 1 season >= 2000.

Sources:
  - nfl_data_py seasonal rosters (1999-2024): teams by season
  - nfl_data_py draft picks: draft team for pre-1999 players

Usage:
  /opt/homebrew/bin/python3.11 scripts/fix_player_careers.py
"""
import json
import sys

try:
    import nfl_data_py as nfl
    import pandas as pd
except ImportError:
    print("ERROR: /opt/homebrew/bin/pip3.11 install nfl_data_py")
    sys.exit(1)

PLAYERS_PATH = "griddy/server/players.json"

# Valid current NFL team abbreviations
VALID_TEAMS = {
    'ARI','ATL','BAL','BUF','CAR','CHI','CIN','CLE','DAL','DEN',
    'DET','GB','HOU','IND','JAX','KC','LAC','LAR','LV','MIA',
    'MIN','NE','NO','NYG','NYJ','PHI','PIT','SEA','SF','TB','TEN','WAS',
}

# Normalize old/alternate abbrs to current
TEAM_REMAP = {
    'OAK': 'LV',    # Raiders moved
    'SD':  'LAC',   # Chargers moved
    'STL': 'LAR',   # Rams moved
    'JAC': 'JAX',
    'LA':  'LAR',
    'HST': 'HOU',
    'CLV': 'CLE',
    'ARZ': 'ARI',
    'BLT': 'BAL',
    'GNB': 'GB',
    'KAN': 'KC',
    'NWE': 'NE',
    'NOR': 'NO',
    'SFO': 'SF',
    'TAM': 'TB',
    'WAS': 'WAS',
    'WSH': 'WAS',
}


def norm(t):
    t = str(t).strip().upper()
    t = TEAM_REMAP.get(t, t)
    return t if t in VALID_TEAMS else None


def normalize_name(n):
    return ' '.join(str(n).strip().split()).lower()


def main():
    print("Loading players.json...")
    with open(PLAYERS_PATH) as f:
        players = json.load(f)
    print(f"  {len(players)} players loaded")

    print("Fetching seasonal rosters 1999-2024...")
    rosters = nfl.import_seasonal_rosters(list(range(1999, 2025)))
    print(f"  {len(rosters)} roster rows")

    print("Fetching draft picks...")
    drafts = nfl.import_draft_picks()
    print(f"  {len(drafts)} draft pick rows")

    # Build name → career data from rosters
    # career[name] = {'teams': set, 'first': int, 'last': int}
    career = {}
    for _, row in rosters.iterrows():
        name = normalize_name(row.get('player_name', ''))
        if not name:
            continue
        team = norm(row.get('team', ''))
        season = int(row.get('season', 0))
        if not team or not season:
            continue
        if name not in career:
            career[name] = {'teams': set(), 'first': season, 'last': season}
        career[name]['teams'].add(team)
        career[name]['first'] = min(career[name]['first'], season)
        career[name]['last'] = max(career[name]['last'], season)

    # Supplement with draft picks for pre-1999 players
    # drafts columns: pfr_player_name, team, season
    draft_lookup = {}  # name → {draft_team, draft_year}
    for _, row in drafts.iterrows():
        name = normalize_name(row.get('pfr_player_name', ''))
        if not name:
            continue
        team = norm(row.get('team', ''))
        season = int(row.get('season', 0)) if row.get('season') else 0
        if not team or not season:
            continue
        # Keep earliest draft entry per player
        if name not in draft_lookup or season < draft_lookup[name]['year']:
            draft_lookup[name] = {'team': team, 'year': season}

    print(f"  Career data for {len(career)} players from rosters")
    print(f"  Draft data for {len(draft_lookup)} players")

    # Patch players.json
    updated = 0
    not_found = 0
    teams_added = 0

    for player in players:
        key = normalize_name(player.get('name', ''))
        if not key:
            continue

        c = career.get(key)
        d = draft_lookup.get(key)

        if c is None and d is None:
            not_found += 1
            continue

        # Determine if player qualifies: played >= 1 season from 2000+
        last_season = c['last'] if c else 0
        if last_season < 2000:
            # Player only appears pre-2000 in rosters; check draft year
            # Draft year alone doesn't tell us if they played post-2000
            # Keep existing data (already filtered correctly in players.json)
            continue

        # Build full team set
        all_teams = list(c['teams']) if c else []

        # Add draft team if pre-1999
        if d and d['year'] < 1999:
            dt = d['team']
            if dt not in all_teams:
                all_teams.append(dt)
                teams_added += 1

        # Preserve team order: original teams first, then new ones
        orig_teams = player.get('teams', [])
        orig_set = set(orig_teams)
        new_teams = [t for t in orig_teams]  # start with original order
        for t in all_teams:
            if t not in orig_set:
                new_teams.append(t)

        # Update years_played from actual career data
        current_first = player['years_played'][0]
        current_last  = player['years_played'][1]
        roster_first  = c['first'] if c else current_first
        roster_last   = c['last']  if c else current_last
        # Draft year may predate roster data
        actual_first = d['year'] if d and d['year'] < roster_first else roster_first
        actual_last  = max(roster_last, current_last)

        new_years = [actual_first, actual_last]
        player['years_played'] = new_years

        if new_teams != orig_teams or new_years != [current_first, current_last]:
            player['teams'] = new_teams
            updated += 1

    print(f"\nResults:")
    print(f"  Updated: {updated} players")
    print(f"  Teams added (pre-1999 draft): {teams_added}")
    print(f"  Not found in nfl_data_py: {not_found}")

    # Spot-check Favre
    favre = [p for p in players if 'Favre' in p.get('name', '')]
    if favre:
        print(f"\nFavre check: {favre[0]}")

    print(f"\nSaving {PLAYERS_PATH}...")
    with open(PLAYERS_PATH, 'w') as f:
        json.dump(players, f, indent=2)
    print("Done.")


if __name__ == '__main__':
    main()
