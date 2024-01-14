import { HttpStatus, Injectable } from '@nestjs/common';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { timeStamp } from 'console';
import { MemberService } from 'src/member/member.service';
import { BookService } from 'src/book/book.service';
import { UpdateMemberDto } from 'src/member/dto/update-member.dto';
import { UpdateBookDto } from 'src/book/dto/update-book.dto';

@Injectable()
export class BorrowService {
  constructor(private prisma: PrismaService, private memberService: MemberService, private bookService: BookService) { }

  async borrowBook(borrowBookDto: BorrowBookDto) {
    const currentBook = await this.bookService.findOne(borrowBookDto.bookId);
    const currentMember = await this.memberService.findOne(borrowBookDto.memberId);

    if (currentBook && currentMember) {
      const currentDate = new Date();

      //check if the books is available
      if (currentBook.data.stock == 0) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "No books in stock"
        };
      }

      //check if the members has 2 books
      if (currentMember.data.borrowCount >= 2) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Member borrows 2 books already"
        };
      }

      //check if the members is locked
      if (currentMember.data.lockReleaseAt != null && currentMember.data.lockReleaseAt >= currentDate) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Member was locked"
        };
      }

      borrowBookDto.returnAt = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      borrowBookDto.isReturned = false;
      const borrow = await this.prisma.borrows.create({
        data: borrowBookDto,
        select: {
          id: true,
          returnAt: true,
          isReturned: true,
          book: {
            select: {
              id: true,
              code: true,
              title: true,
              author: true
            }
          },
          member: {
            select: {
              id: true,
              code: true,
              name: true,
            }
          }
        }
      });
      if (borrow) {
        const updateBookDto = new UpdateBookDto();
        updateBookDto.version = currentBook.data.version;
        updateBookDto.stock = currentBook.data.stock - 1;
        await this.bookService.update(+borrow.book.id, updateBookDto);

        const updateMemberDto = new UpdateMemberDto();
        updateMemberDto.version = currentMember.data.version;
        updateMemberDto.borrowCount = currentMember.data.borrowCount + 1;

        await this.memberService.update(+borrow.member.id, updateMemberDto)

        return {
          statusCode: HttpStatus.OK,
          data: borrow
        };
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to create data"
        };
      }
    }
  }

  async returnBook(id: number, returnBookDto: ReturnBookDto) {
    const borrow = await this.prisma.borrows.findFirst({
      where: {
        id: id,
        isReturned: false
      },
      orderBy: {
        borrowAt: 'asc'
      }
    })

    if (borrow) {
      const currentDate = new Date();
      returnBookDto.isReturned = true;
      returnBookDto.returnedAt = currentDate;

      const updatedBorrow = await this.prisma.borrows.update({
        where: {
          id: id
        },
        data: returnBookDto,
        select: {
          id: true,
          returnAt: true,
          isReturned: true,
          book: {
            select: {
              id: true,
              code: true,
              title: true,
              author: true
            }
          },
          member: {
            select: {
              id: true,
              code: true,
              name: true,
            }
          }
        }
      });
      if (updatedBorrow) {
        const currentBook = await this.bookService.findOne(returnBookDto.bookId);
        const currentMember = await this.memberService.findOne(returnBookDto.memberId);

        if (currentBook && currentMember) {
          const updateBookDto = new UpdateBookDto();
          updateBookDto.version = currentBook.data.version;
          updateBookDto.stock = currentBook.data.stock + 1;
          await this.bookService.update(+updatedBorrow.book.id, updateBookDto);

          const updateMemberDto = new UpdateMemberDto();
          if (borrow.returnAt > currentDate) {
            updateMemberDto.lockReleaseAt = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
          }
          updateMemberDto.version = currentMember.data.version;
          updateMemberDto.borrowCount = currentMember.data.borrowCount - 1;
          await this.memberService.update(+updatedBorrow.book.id, updateMemberDto)
        }
        return {
          statusCode: HttpStatus.OK,
          data: updatedBorrow
        };
      }
      else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Data was not found"
        };
      }
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Data was not found"
      };
    }

  }
}
