// https://stackoverflow.com/a/27979933
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
    // This should never be reached, but just in case...
    return c;
  });
}

export default class SimpleTwimlResponse {
  private readonly messages: string[] = [];

  message(text: string): this {
    this.messages.push(text);
    return this;
  }

  toString(): string {
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<Response>',
      ...this.messages.map(message => `  <Message>${escapeXml(message)}</Message>`),
      '</Response>',
    ].join('\n');
  }
}
