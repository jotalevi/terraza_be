import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TicketService } from 'src/ticket/ticket.service';

@Module({
  imports: [TicketService],
  controllers: [OrderController],
  providers: [OrderService, TicketService],
})
export class OrderModule {}
