import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class TradeOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['BTCUSD', 'ETHUSD'])
  pairName: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['buy', 'sell'])
  operationType: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  priceLimit?: number;
}
