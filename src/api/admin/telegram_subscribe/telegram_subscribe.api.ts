import { BaseApi } from '../../base.api.ts';
import type { TelegramSubscribe } from "../../../types/TelegramSubscribe.ts";

export class TelegramSubscribeApi extends BaseApi<null, TelegramSubscribe> {
    protected resource = 'telegram-subscribers';
}