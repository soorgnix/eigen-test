import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBookDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    author: string;
  
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    stock: number;

    version: number;
}
