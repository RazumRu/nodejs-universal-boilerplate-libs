import { IsEnum } from 'class-validator';
import { HealthStatus } from '../http-server.types';
import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @IsEnum(HealthStatus)
  @ApiProperty()
  status: HealthStatus;
}
