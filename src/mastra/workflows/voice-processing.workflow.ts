import { Mistral } from "@mistralai/mistralai";
import { MessageProcessingWorkflow } from "./message-processing.workflow";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VoiceProcessingWorkflow {
    name = 'voice-processing';
    description = 'Workflow to process voice messages with Mastra';
    private mistral: Mistral;

    constructor(private readonly messageProcessingWorkflow: MessageProcessingWorkflow) {
        this.mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY});
    }

    async execute(input: {
        audio: Uint8Array<ArrayBufferLike>;
        mediaType: string;
        voiceFileId: string;
        userId: string;
        chatId: string;
    }) : ReturnType<typeof this.messageProcessingWorkflow.execute> {
        const { audio, mediaType } = input;
        
        // Convert audio data to Blob if it's Uint8Array
        // If audio is Uint8Array, convert to Blob
        const regularArray = new Uint8Array(audio);
        const audioFile = new Blob([regularArray], { type: mediaType || 'audio/ogg' });
    

        const transcription = await this.mistral.audio.transcriptions.complete({
            model: 'voxtral-mini-latest',
            file: audioFile
        });
        
        // Handle transcription response properly
        const transcriptionText = typeof transcription === 'string' ? transcription : transcription.text;
        
        return this.messageProcessingWorkflow.execute({
            message: transcriptionText,
            userId: input.userId,
            chatId: input.chatId,
        });
    }
}