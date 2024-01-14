import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Borrow")
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  borrow(@Body() borrowBookDto: BorrowBookDto) {
    return this.borrowService.borrowBook(borrowBookDto);
  }

  @Patch('return:id')
  return(@Param('id') id: string, @Body() returnBookDto: ReturnBookDto) {
    return this.borrowService.returnBook(+id, returnBookDto);
  }
}
