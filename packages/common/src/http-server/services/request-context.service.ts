import { FastifyRequest } from 'fastify';
import rTracer from 'cls-rtracer';
import { Inject, Injectable } from '@nestjs/common';
import { IRequestData } from '../http-server.types';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class RequestContextService {
  constructor(
    @Inject(REQUEST)
    public readonly request: FastifyRequest & FastifyRequest['raw'],
  ) {}

  public getRequestData(): IRequestData {
    const requestId = (rTracer?.id() as string) || '';

    return {
      userId: (<any>this.request).__contextData?.userId,
      requestId,
      ip: this.request.ip,
      method: this.request.method,
      body: this.request.body,
      url: this.request.originalUrl,
    };
  }
}
