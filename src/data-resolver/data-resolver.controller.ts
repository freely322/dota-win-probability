import { Controller, Get, Body, Param } from '@nestjs/common';
import { DataResolverService } from './data-resolver.service';
import {ApiExtension, ApiHeader, ApiResponse, ApiTags} from "@nestjs/swagger";

@Controller('data-resolver')
export class DataResolverController {
  constructor(private readonly dataResolverService: DataResolverService) {}

  @ApiTags('Get all schemas')
  @ApiResponse({
    status: 200,
    description: 'All table schemas returned in JSON format',
    schema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'object',
          properties: {
            column_name: {
              type: 'object',
              properties: {
                data_type: {
                  type: 'string',
                  enum: [
                    'text',
                    'uuid',
                    'real',
                    'json',
                    'date',
                    'ARRAY',
                    'jsonb',
                    'bigint',
                    'integer',
                    'boolean',
                    'smallint',
                    'double precision',
                    'character varying',
                    'timestamp with time zone',
                    'timestamp without time zone'
                  ]
                }
              }
            }
          }
        }
      }
    }
  })
  @Get('schema')
  async getSchemas() {
    return await this.dataResolverService.getSchemas();
  }

  @ApiTags('Get all heroes')
  @ApiResponse({
    status: 200,
    description: 'All heroes returned in JSON format',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 16
          },
          name: {
            type: 'string',
            example: 'npc_dota_hero_sand_king'
          },
          localized_name: {
            type: 'string',
            example: 'Sand King'
          },
          primary_attr: {
            type: 'string',
            example: 'str'
          },
          attack_type: {
            type: 'string',
            example: 'Melee'
          },
          roles: {
            type: 'array',
            example: [
              "Initiator",
              "Disabler",
              "Support",
              "Nuker",
              "Escape",
              "Jungler"
            ]
          },
          legs: {
            type: 'number',
            example: 6
          }
        }
      }
    }
  })
  @Get('heroes')
  async getHeroes() {
    return await this.dataResolverService.getHeroes();
  }

  @Get('leagues')
  async getLeagues() {
    return await this.dataResolverService.getLeagues();
  }

  @Get('league_matches/:id')
  async getLeagueMatches(@Param('id') id) {
    return await this.dataResolverService.getLeagueMatches(id);
  }

}
