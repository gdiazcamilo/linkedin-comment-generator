import { ConversationTone } from "../enums";

export interface AIClient {
  generate_comment(post_content: string, reply_to: string | null, tone: ConversationTone | null): Promise<string>;
  generate_comment_stream(post_content: string, reply_to: string | null, tone: ConversationTone | null): ReadableStream<string>;
}
