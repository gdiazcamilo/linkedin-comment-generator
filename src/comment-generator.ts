export async function generateComment(_postContent: string, _referencedCommentText: string | null): Promise<string> {
  const fakeComment =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeComment);
    }, 1000);
  });
}
