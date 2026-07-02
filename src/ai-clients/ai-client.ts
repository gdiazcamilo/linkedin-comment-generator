import { ConversationTone } from "../enums";

export interface AIClient {
  generate_comment(post_content: string, reply_to: string | null, tone: ConversationTone | null): Promise<string>;
}
