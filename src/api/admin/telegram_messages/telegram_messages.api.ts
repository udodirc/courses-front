import { BaseApi } from '../../base.api.ts';
import type { TelegramMessages } from '../../../types/TelegramMessages';
import type { CreateTelegramMessagesDto } from '../../../dto/telegram_messages.dto.ts';

export class TelegramMessagesApi extends BaseApi<CreateTelegramMessagesDto, TelegramMessages> {
    protected resource = 'telegram-messages';
}