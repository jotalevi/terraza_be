import { Controller, Get, Query, Redirect } from '@nestjs/common';
import { OrderService } from './order.service';
import makeid from 'src/util/customIds/customId';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('api/init_transaction')
  async getInitTransaction(
    @Query('price') price: number,
    @Query('qty') qty: number,
    @Query('mail') mail: string,
  ): Promise<any> {
    let opts = {
      buyOrder: makeid(8),
      sessionId: makeid(8),
      price: price,
      qty: qty,
      mail: mail,
    };

    return this.orderService.initTransaction(opts);
  }

  @Redirect('https://terrazastgo.com/', 301)
  @Get('api/commit')
  async getCommitTransaction(
    @Query('token_ws') token: string,
    @Query('bo') buyOrder: string,
    @Query('TBK_TOKEN') _token: string,
  ): Promise<any> {
    return this.orderService.commitTransaction(token, buyOrder, _token);
  }

  @Get('api/sendTicket')
  async sendTickets(@Query('qty') qty: number): Promise<any> {
    return this.orderService.sendTickets('talevineto@gmail.com', qty);
  }
}
