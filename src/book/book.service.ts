import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) { }

  async create(createBookDto: CreateBookDto) {
    createBookDto.version = 1;
    const book = await this.prisma.books.create({
      data: createBookDto,
      select: {
        code: true,
        title: true,
        author: true,
        stock: true
      }
    });
    if (book) {
      return {
        statusCode: HttpStatus.OK,
        data: book
      };
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to create data"
      };
    }
  }

  async findAll() {
    const books = await this.prisma.books.findMany({
      include: {
        borrow: {
          where: {
            isReturned: false,
          },
          select: {
            member: {
              select: {
                id: true,
                code: true,
                name: true,
              }
            },
            borrowAt: true,
            returnAt: true
          },
        },
      },
    });

    if (books) {
      return {
        statusCode: HttpStatus.OK,
        data: books
      };
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Data was not found"
      };
    }

  }

  async findOne(id: number) {
    const book = await this.prisma.books.findFirst({
      where: {
        id: id
      },
      include: {
        borrow: {
          where: {
            isReturned: false,
          },
          select: {
            member: {
              select: {
                id: true,
                code: true,
                name: true,
              }
            },
            borrowAt: true,
            returnAt: true
          },
        },
      },
    });

    if (book) {
      return {
        statusCode: HttpStatus.OK,
        data: book
      };
    }
    else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Data was not found"
      };
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const version = updateBookDto.version;
    const newVersion = version + 1;
    updateBookDto.version = newVersion;
    const book = await this.prisma.books.update({
      where: {
        id: id,
        version: version
      },
      data: updateBookDto,
      select: {
        code: true,
        title: true,
        author: true,
        stock: true,
        version: true
      }
    });
    if (book) {
      return {
        statusCode: HttpStatus.OK,
        data: book
      };
    }
    else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Data was not found or changed"
      };
    }
  }

  async remove(id: number) {
    const book = await this.prisma.books.delete({
      where: {
        id: id
      },
      select: {
        code: true,
        title: true,
        author: true,
        stock: true
      }
    });
    if (book) {
      return {
        statusCode: HttpStatus.OK,
        data: book
      };
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to delete data"
      };
    }
  }
}
