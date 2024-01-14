import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMemberDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
     
    lockReleaseAt: Date;

    lockedAt: Date;

    borrowCount: number;

    version: number;
}
