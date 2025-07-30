import { Controller, Get, Post, Body, Param, ValidationPipe } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { StartMatchDto } from './dto/start-match.dto';
import { AddCommentaryDto } from './dto/add-commentary.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('start')
  async startMatch(@Body(ValidationPipe) startMatchDto: StartMatchDto) {
    return this.matchesService.startMatch(startMatchDto);
  }

  @Post(':id/commentary')
  async addCommentary(
    @Param('id') matchId: string,
    @Body(ValidationPipe) addCommentaryDto: AddCommentaryDto,
  ) {
    return this.matchesService.addCommentary(matchId, addCommentaryDto);
  }

  @Get(':id')
  async getMatch(@Param('id') matchId: string) {
    return this.matchesService.getMatch(matchId);
  }

  @Get()
  async getAllMatches() {
    return this.matchesService.getAllMatches();
  }

  @Post(':id/pause')
  async pauseMatch(@Param('id') matchId: string) {
    return this.matchesService.pauseMatch(matchId);
  }

  @Post(':id/resume')
  async resumeMatch(@Param('id') matchId: string) {
    return this.matchesService.resumeMatch(matchId);
  }

  @Post(':id/complete')
  async completeMatch(@Param('id') matchId: string) {
    return this.matchesService.completeMatch(matchId);
  }

  @Get(':id/commentaries/latest')
  async getLatestCommentaries(@Param('id') matchId: string) {
    return this.matchesService.getLatestCommentaries(matchId);
  }
} 