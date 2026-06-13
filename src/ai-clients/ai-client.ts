export interface AIClient {
  generate_comment(post_content: string, reply_to: string | null): Promise<string>;
}
