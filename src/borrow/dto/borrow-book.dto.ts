import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber} from "class-validator";

export class BorrowBookDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    bookId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    memberId: number;
   
    isReturned: boolean;

    returnAt: Date;
    
    returnedAt: Date;
}
