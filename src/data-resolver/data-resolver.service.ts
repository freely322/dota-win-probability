import { HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class DataResolverService {
  constructor(
    private _httpService: HttpService
  ) {};

  async getSchemas(): Promise<any> {
    try {
      const res = await this._httpService.get(`/schema`).toPromise();
      switch (true) {
        case (200 <= res.status && res.status < 300):
          return res.data.reduce((schemas, col) => ({
            ...schemas,
            [col.table_name]: {
              ...schemas[col.table_name],
              [col.column_name]: col.data_type
            }
          }), {})
        default:
          return `Request ended with ${res.status} code and I don't know what to do with that`
      }
    } catch (e) {
      return e.message;
    }
  }

  async getHeroes(): Promise<any> {
    try {
      const res = await this._httpService.get(`/explorer`, {
        params: {
          sql: 'SELECT * FROM heroes'
        }
      }).toPromise();
      switch (true) {
        case (200 <= res.status && res.status < 300):
          return res.data.rows
        default:
          return `Request ended with ${res.status} code and I don't know what to do with that`
      }
    } catch (e) {
      return e.message;
    }
  }

  async getLeagues(): Promise<any> {
    try {
      const res = await this._httpService.get(`/explorer`, {
        params: {
          sql: "SELECT * FROM leagues WHERE tier = 'premium'"
        }
      }).toPromise();
      switch (true) {
        case (200 <= res.status && res.status < 300):
          return res.data.rows
        default:
          return `Request ended with ${res.status} code and I don't know what to do with that`
      }
    } catch (e) {
      return e.message;
    }
  }

  async getLeagueMatches(leagueId): Promise<any> {
    try {
      const [resMatches, resTeamsRd, resTeamsDr] = await Promise.all([
        this._httpService.get(`/explorer`, {
          params: {
            sql: `SELECT picks_bans, dire_team_id, radiant_team_id, duration, radiant_win, match_id FROM matches WHERE leagueid = '${leagueId}' LIMIT 25`
          }
        }).toPromise(),
        this._httpService.get(`/explorer`, {
          params: {
            sql: `SELECT ARRAY (SELECT radiant_team_id FROM matches WHERE leagueid = '${leagueId}' LIMIT 25)`
          }
        }).toPromise(),
        this._httpService.get(`/explorer`, {
          params: {
            sql: `SELECT ARRAY (SELECT dire_team_id FROM matches WHERE leagueid = '${leagueId}' LIMIT 25)`
          }
        }).toPromise(),
      ])
      const radiantTeams = resTeamsRd.data.rows[0].array
      const direTeams = resTeamsDr.data.rows[0].array
      const teams = [...radiantTeams, ...direTeams].filter((value, index, self) => self.indexOf(value) === index)
      const resTeams = await this._httpService.get(`/explorer`, {
        params: {
          sql: `SELECT * FROM teams WHERE team_id IN (${teams.join(', ')}) LIMIT 25`
        }
      }).toPromise()
      const resTeamsRating = await this._httpService.get(`/explorer`, {
        params: {
          sql: `SELECT * FROM team_rating WHERE team_id IN (${teams.join(', ')}) LIMIT 25`
        }
      }).toPromise()
      const teamsFilled = {}
      resTeams.data.rows.map(team => teamsFilled[team.team_id] = team)
      resTeamsRating.data.rows.map(team => teamsFilled[team.team_id] = { ...teamsFilled[team.team_id], ...team })
      console.log(teamsFilled)
      switch (true) {
        case (200 <= resMatches.status && resMatches.status < 300):
          return resMatches.data.rows
        default:
          return `Request ended with ${resMatches.status} code and I don't know what to do with that`
      }
    } catch (e) {
      return e.message;
    }
  }
}
