import { IsString, MinLength } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @MinLength(2)
  name: string;
}