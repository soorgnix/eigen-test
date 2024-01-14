import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookModule } from 'src/book/book.module';
import { MemberModule } from 'src/member/member.module';
import { BookService } from 'src/book/book.service';
import { MemberService } from 'src/member/member.service';

@Module({
  imports:[PrismaModule, BookModule, MemberModule],
  controllers: [BorrowController],
  providers: [BorrowService, BookService, MemberService],
})
export class BorrowModule {}
