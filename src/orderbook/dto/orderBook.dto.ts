import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class OrderbookDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['BTCUSD', 'ETHUSD'])
  pairName: string;
}
