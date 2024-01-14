import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { MemberModule } from './member/member.module';
import { BorrowModule } from './borrow/borrow.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [BookModule, MemberModule, BorrowModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
