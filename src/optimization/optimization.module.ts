import { Module } from '@nestjs/common';
import { OptimizationController } from './optimization.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [OptimizationController],
  imports: [HttpModule],
})
export class OptimizationModule {}
