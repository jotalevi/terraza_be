import { Injectable } from '@nestjs/common';
import { DataStore } from 'src/util/dataStore/dataStore';
import {
  WebpayPlus,
  Options,
  IntegrationApiKeys,
  Environment,
  IntegrationCommerceCodes,
} from 'transbank-sdk';
import { Order } from './order.obj';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class OrderService {
  constructor(private readonly ticketService: TicketService) {}

  async initTransaction(opts) {
    const tx = new WebpayPlus.Transaction(
      new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration,
      ),
    );

    const response = await tx.create(
      opts.buyOrder,
      opts.sessionId,
      opts.price,
      'https://terrazastgo.com/api/commit/?bo=' + opts.buyOrder,
    );

    DataStore.saveOrder({
      buyOrder: opts.buyOrder,
      sessionId: opts.sessionId,
      qty: opts.qty,
      price: opts.price,
      isAproved: false,
      mail: opts.mail,
    } as Order);

    return response;
  }

  async commitTransaction(token, buyOrder, _token) {
    if (_token) {
      return {
        url: 'https://terrazastgo.com/tbk_fail',
        statusCode: 301,
      };
    }

    const tx = new WebpayPlus.Transaction(
      new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration,
      ),
    );

    if (
      (DataStore.getOrder(buyOrder) as Order).qty >
      DataStore.getAvailableTickets()
    ) {
      return {
        url: 'https://terrazastgo.com/tbk_fail',
        statusCode: 301,
      };
    }

    let resData = await tx.commit(token);

    if (resData.status == 'AUTHORIZED') {
      let fullOrderData = DataStore.getOrder(resData.buy_order) as Order;
      DataStore.setAvailableTickets(
        (DataStore.getOrder(buyOrder) as Order).qty * -1,
      );

      let ticketsCreated = await this.ticketService.createTickets(
        (DataStore.getOrder(buyOrder) as Order).qty,
        fullOrderData.mail,
      );

      console.log(ticketsCreated);

      return {
        url: 'https://terrazastgo.com/tbk_success',
        statusCode: 301,
      };
    } else {
      return {
        url: 'https://terrazastgo.com/tbk_fail',
        statusCode: 301,
      };
    }
  }

  async sendTickets(mail, qty) {
    await this.ticketService.createTickets(mail, qty);
  }
}
