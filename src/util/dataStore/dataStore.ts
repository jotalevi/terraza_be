import * as fs from 'fs';
import { Order } from 'src/order/order.obj';

export class DataStore {
  private static loadData = () => {
    return JSON.parse(
      fs.readFileSync('./src/util/dataStore/dataStore.json').toString(),
    );
  };

  private static saveData = (data) => {
    fs.writeFileSync(
      './src/util/dataStore/dataStore.json',
      JSON.stringify(data),
    );
  };

  static getAvailableTickets = (): number => {
    let data = DataStore.loadData();

    return data.availableTickets;
  };

  static setAvailableTickets = (deltaOrSubs) => {
    let data = DataStore.loadData();

    if (deltaOrSubs < 0) {
      data.availableTickets = data.availableTickets + deltaOrSubs;
      if (data.availableTickets < 0) {
        data.availableTickets = 0;
      }
    } else {
      data.availableTickets = deltaOrSubs;
    }

    DataStore.saveData(data);
  };

  static saveOrder = (orderData) => {
    let data = DataStore.loadData();

    for (var order of data.orders) {
      order = order as Order;
      if (order.buyOrder == orderData.buyOrder) {
        order.isAproved = orderData.isAproved;

        DataStore.saveData(data);

        return;
      }
    }

    data.orders.push(orderData);

    DataStore.saveData(data);
  };

  static getOrder = (orderId): Order | boolean => {
    let data = DataStore.loadData();

    for (const order of data.orders) {
      if ((order as Order).buyOrder == orderId) {
        return order as Order;
      }
    }

    return false;
  };
}
