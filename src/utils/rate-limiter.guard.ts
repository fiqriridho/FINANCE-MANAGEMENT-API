import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

interface ClientRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private readonly clients = new Map<string, ClientRecord>();
  private readonly windowMs = 60 * 1000; // 1 minute
  private readonly maxRequests = 100; // 100 requests per minute

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const ip =
      request.ip ||
      request.headers['x-forwarded-for']?.toString() ||
      'unknown-ip';

    const now = Date.now();
    const record = this.clients.get(ip);

    if (!record || now > record.resetTime) {
      this.clients.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    record.count += 1;

    if (record.count > this.maxRequests) {
      throw new HttpException(
        'Too many requests, please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
