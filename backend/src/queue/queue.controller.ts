import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { QueueService, CreateQueueDto } from './queue.service';
import { QueueStatus } from './queue.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/user.entity';

@Controller('queues')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  async create(@Body() dto: CreateQueueDto) {
    return this.queueService.create(dto);
  }

  @Get()
  async findAll(
    @Query('status') status?: QueueStatus,
    @Query('category_id') categoryId?: string,
  ) {
    return this.queueService.findAll(status, categoryId ? +categoryId : undefined);
  }

  @Get('today')
  async findToday() {
    return this.queueService.findToday();
  }

  @Get('current')
  async getCurrent() {
    return this.queueService.getCurrent();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.queueService.findById(+id);
  }

  @Post(':id/call')
  @UseGuards(JwtAuthGuard)
  async call(@Param('id') id: string, @Body('counter_number') counterNumber?: number) {
    return this.queueService.call(+id, counterNumber);
  }

  @Post(':id/serve')
  @UseGuards(JwtAuthGuard)
  async serve(@Param('id') id: string) {
    return this.queueService.serve(+id);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  async complete(@Param('id') id: string) {
    return this.queueService.complete(+id);
  }

  @Post(':id/skip')
  @UseGuards(JwtAuthGuard)
  async skip(@Param('id') id: string) {
    return this.queueService.skip(+id);
  }

  @Post(':id/recall')
  @UseGuards(JwtAuthGuard)
  async recall(@Param('id') id: string) {
    return this.queueService.recall(+id);
  }

  @Post(':id/reannounce')
  @UseGuards(JwtAuthGuard)
  async reannounce(@Param('id') id: string) {
    return this.queueService.reannounce(+id);
  }

  @Post('reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async resetDaily() {
    await this.queueService.resetDaily();
    return { success: true };
  }
}
