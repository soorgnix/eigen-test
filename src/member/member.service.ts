import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) { }

  async create(createMemberDto: CreateMemberDto) {
    createMemberDto.version = 1;
    createMemberDto.borrowCount = 0;
    const member = await this.prisma.members.create({
      data: createMemberDto,
      select: {
        code: true,
        name: true
      }
    });
    if (member) {
      return {
        statusCode: HttpStatus.OK,
        data: member
      };
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to create data"
      };
    }
  }

  async findAll() {
    const members = await this.prisma.members.findMany({
      include: {
        borrow: {
          where: {
            isReturned: false,
          },
          select: {
            book: {
              select: {
                id: true,
                code: true,
                title: true,
                author: true,
              }
            },
            borrowAt: true,
            returnAt: true
          },
        },
      },
    });

    if (members) {
      return {
        statusCode: HttpStatus.OK,
        data: members
      };
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Data was not found"
      };
    }
  }

  async findOne(id: number) {
    const member = await this.prisma.members.findFirst({
      where: {
        id: id
      },
      include: {
        borrow: {
          where: {
            isReturned: false,
          },
          select: {
            book: {
              select: {
                id: true,
                code: true,
                title: true,
                author: true,
              }
            },
            borrowAt: true,
            returnAt: true
          },
        },
      },
    });

    if (member) {
      return {
        statusCode: HttpStatus.OK,
        data: member
      };
    }
    else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Data was not found"
      };
    }
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const version = updateMemberDto.version;
    const newVersion = version + 1;
    updateMemberDto.version = newVersion;
    const member = await this.prisma.members.update({
      where: {
        id: id,
        version: version
      },
      data: updateMemberDto,
      select: {
        id: true,
        code: true,
        name: true,
        version: true
      }
    });
    if (member) {
      return {
        statusCode: HttpStatus.OK,
        data: member
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
    const member = await this.prisma.members.delete({
      where: {
        id: id
      },
      select: {
        id: true,
        code: true,
        name: true
      }
    });
    if (member) {
      return {
        statusCode: HttpStatus.OK,
        data: member
      };
    } else {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to delete data"
      };
    }
  }
}
