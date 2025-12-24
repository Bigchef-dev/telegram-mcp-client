import { Injectable, Logger } from "@nestjs/common";
import { Context } from "telegraf";
import { MessageProcessingWorkflow } from "@/mastra/workflows/message-processing.workflow";
import { TelegramReplyService } from "./telegram-reply.service";

@Injectable()
export class LLMTelegramService {
    protected readonly logger = new Logger(this.constructor.name);
    
    constructor(
        private readonly telegramReplyService: TelegramReplyService,
        private readonly messageProcessingWorkflow: MessageProcessingWorkflow,
    ) {}

    async process(ctx: Context, message: string, userId: string, chatId: string) {
        ctx.sendChatAction('typing');


        const result = await this.messageProcessingWorkflow.execute({
            message,
            userId,
            chatId,
        });
        this.logger.log(`Received text message from user ${userId}: ${message}`);

        const text = this.textOfResult(result);
        this.telegramReplyService.sendFormattedReply(ctx, text);        
    }

    textOfResult(result: any) {
        this.logger.log(`Mastra processed message: ${result}`);

        return result.text;
    }
}