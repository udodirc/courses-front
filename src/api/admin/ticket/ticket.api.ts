import { BaseApi } from '../../base.api.ts';
import type { Ticket } from '../../../types/Ticket.ts';
import type { CreateTicketDto } from '../../../dto/ticket.dto.ts';

export class TicketApi extends BaseApi<CreateTicketDto, Ticket> {
    protected resource = 'tickets';
}