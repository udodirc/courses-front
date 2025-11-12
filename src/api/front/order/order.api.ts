import { BaseApi } from '../../base.api.ts';
import type { Order } from '../../../types/Order';
import type { CreateOrderDto } from '../../../dto/order.dto.ts';
export class FrontOrderApi extends BaseApi<CreateOrderDto, Order> {
    protected resource = 'order';
    protected urlPrefix = '/partner';
}