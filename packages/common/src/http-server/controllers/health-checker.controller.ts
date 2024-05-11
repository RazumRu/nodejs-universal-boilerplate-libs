import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheckResponseDto } from '../dto/health-check-response.dto';
import { HealthStatus } from '../http-server.types';

@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
@ApiTags('health')
export class HealthCheckerController {
  @Get('check')
  @ApiOkResponse({
    description: 'Service health check',
    type: HealthCheckResponseDto,
  })
  public async check(): Promise<HealthCheckResponseDto> {
    return { status: HealthStatus.Ok };
  }
}
