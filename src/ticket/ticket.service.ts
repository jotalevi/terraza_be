export class TicketService {
  async createTickets(mailAddress, qty): Promise<number> {
    let i = 1;
    while (i <= qty) {
      let data = await this.createTicket(
        mailAddress.split('@')[0] + '+' + i + mailAddress.split('@')[1],
      );

      console.log(data);

      i++;
    }

    return i - 1;
  }

  async createTicket(mailAddress): Promise<any> {
    var myHeaders = new Headers();
    myHeaders.append(
      'X-API-KEY',
      '82233344d7f3e54867f5f782b655895838ba4a7fd414bd1d',
    );

    var response = await fetch(
      `https://apis.ticket-generator.com/client/v1/ticket/send/?eventId=65b2084da61dde4b6ecd29ab&email=${mailAddress}
      &subject=Entradas%20para%20Terraza%20001&body=Aqui%20estan%20sus%20entradas%20para%20el%20evento%20Terraza%20001&fromName=Terraza%20Santo%20Domingo`,
      {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      },
    );

    return response;
  }
}
