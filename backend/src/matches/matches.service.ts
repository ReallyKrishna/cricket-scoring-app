import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import { Commentary, CommentaryDocument } from './schemas/commentary.schema';
import { StartMatchDto } from './dto/start-match.dto';
import { AddCommentaryDto } from './dto/add-commentary.dto';
import { RedisService } from '../redis/redis.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class MatchesService {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    @InjectModel(Commentary.name) private commentaryModel: Model<CommentaryDocument>,
    private redisService: RedisService,
  ) {}

  async generateMatchId(): Promise<string> {
    const counter = await this.redisService.incr('match_counter');
    return counter.toString().padStart(4, '0');
  }

  async startMatch(startMatchDto: StartMatchDto): Promise<Match> {
    const matchId = await this.generateMatchId();
    
    const match = new this.matchModel({
      matchId,
      ...startMatchDto,
      date: new Date(startMatchDto.date),
    });

    const savedMatch = await match.save();
    
    // Broadcast new match to all connected clients
    this.server.emit('matchStarted', savedMatch);
    
    return savedMatch;
  }

  async addCommentary(matchId: string, addCommentaryDto: AddCommentaryDto): Promise<Commentary> {
    const match = await this.matchModel.findOne({ matchId });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.status === 'completed') {
      throw new BadRequestException('Cannot add commentary to completed match');
    }

    const commentary = new this.commentaryModel({
      matchId: match._id,
      ...addCommentaryDto,
    });

    const savedCommentary = await commentary.save();

    // Update match statistics
    await this.updateMatchStats(match, addCommentaryDto);

    // Store in Redis cache (latest 10 commentaries)
    const cacheKey = `commentary:${matchId}`;
    await this.redisService.lpush(cacheKey, JSON.stringify(savedCommentary));
    await this.redisService.ltrim(cacheKey, 0, 9); // Keep only latest 10

    // Broadcast commentary update
    this.server.emit('commentaryAdded', {
      matchId,
      commentary: savedCommentary,
    });

    return savedCommentary;
  }

  private async updateMatchStats(match: MatchDocument, commentary: AddCommentaryDto): Promise<void> {
    const runs = commentary.runs || 0;
    const extraRuns = commentary.extraRuns || 0;
    const totalRuns = runs + extraRuns;

    if (match.battingTeam === 'team1') {
      match.team1Score += totalRuns;
      if (commentary.isWicket) {
        match.team1Wickets += 1;
      }
    } else {
      match.team2Score += totalRuns;
      if (commentary.isWicket) {
        match.team2Wickets += 1;
      }
    }

    // Update over and ball
    if (commentary.over > match.currentOver) {
      match.currentOver = commentary.over;
      match.currentBall = commentary.ball;
    } else if (commentary.over === match.currentOver && commentary.ball > match.currentBall) {
      match.currentBall = commentary.ball;
    }

    await match.save();
  }

  async getMatch(matchId: string): Promise<any> {
    const match = await this.matchModel.findOne({ matchId });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const commentaries = await this.commentaryModel
      .find({ matchId: match._id })
      .sort({ over: 1, ball: 1, createdAt: 1 })
      .exec();

    return {
      ...match.toObject(),
      commentaries,
    };
  }

  async getAllMatches(): Promise<Match[]> {
    return this.matchModel.find().sort({ createdAt: -1 }).exec();
  }

  async getLatestCommentaries(matchId: string): Promise<Commentary[]> {
    const cachedCommentaries = await this.redisService.lrange(`commentary:${matchId}`, 0, 9);
    return cachedCommentaries.map(c => JSON.parse(c));
  }

  async pauseMatch(matchId: string): Promise<Match> {
    const match = await this.matchModel.findOne({ matchId });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    match.status = 'paused';
    await match.save();

    this.server.emit('matchPaused', { matchId });
    return match;
  }

  async resumeMatch(matchId: string): Promise<Match> {
    const match = await this.matchModel.findOne({ matchId });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    match.status = 'active';
    await match.save();

    this.server.emit('matchResumed', { matchId });
    return match;
  }

  async completeMatch(matchId: string): Promise<Match> {
    const match = await this.matchModel.findOne({ matchId });
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    match.status = 'completed';
    await match.save();

    this.server.emit('matchCompleted', { matchId });
    return match;
  }
} 