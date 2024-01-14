import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class ReturnBookDto {
    bookId: number;

    memberId: number;
   
    isReturned: boolean;

    returnAt: Date;
    
    returnedAt: Date;
}