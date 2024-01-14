import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('Create Book', async () => {
    const createBookDto = new CreateBookDto();
    createBookDto.code = 'Test Code';
    createBookDto.author = 'Test Author';
    createBookDto.title = 'Test Title';
    createBookDto.stock = 0;
    expect(await service.create(createBookDto)).toEqual(service.create);
  });
});
