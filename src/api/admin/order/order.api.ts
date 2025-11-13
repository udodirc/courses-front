import { BaseApi } from '../../base.api.ts';
import type { CreateOrderDto } from "../../../dto/order.dto.ts";
import type { Order } from "../../../types/Order.ts";

export class OrderApi extends BaseApi<CreateOrderDto, Order> {
    protected resource = 'orders';
    //protected urlPrefix = '/partner';
}