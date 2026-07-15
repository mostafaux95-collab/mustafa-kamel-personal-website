import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { BaseRepository } from '../common/base/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<PrismaService['user']> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.user);
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
