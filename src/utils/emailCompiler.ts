export type ContentBlock = 
  | { id: string; type: 'text'; content: string; align: 'left' | 'center' | 'right'; color: string }
  | { id: string; type: 'image'; url: string; alt: string; link?: string }
  | { id: string; type: 'button'; label: string; url: string; color: string; textColor: string }
  | { id: string; type: 'spacer'; height: number }
  | { id: string; type: 'divider'; color: string; padding: number };

export function compileEmailHtml(blocks: ContentBlock[]): string {
  const renderedBlocks = blocks.map(block => {
    switch (block.type) {
      case 'text':
        return `
          <tr>
            <td align="${block.align}" style="padding: 16px; font-family: sans-serif; color: ${block.color}; line-height: 1.6;">
              ${block.content}
            </td>
          </tr>
        `;
      case 'image':
        const img = `<img src="${block.url}" alt="${block.alt}" width="100%" style="display: block; border: 0; max-width: 100%;" />`;
        const inner = block.link ? `<a href="${block.link}" target="_blank">${img}</a>` : img;
        return `
          <tr>
            <td align="center" style="padding: 0;">
              ${inner}
            </td>
          </tr>
        `;
      case 'button':
        return `
          <tr>
            <td align="center" style="padding: 24px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 6px;" bgcolor="${block.color}">
                    <a href="${block.url}" target="_blank" style="font-family: sans-serif; font-size: 16px; font-weight: bold; color: ${block.textColor}; text-decoration: none; border-radius: 6px; padding: 14px 28px; border: 1px solid ${block.color}; display: inline-block;">
                      ${block.label}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `;
      case 'spacer':
        return `
          <tr>
            <td height="${block.height}" style="font-size: ${block.height}px; line-height: ${block.height}px;">&nbsp;</td>
          </tr>
        `;
      case 'divider':
        return `
          <tr>
            <td align="center" style="padding: ${block.padding}px 16px;">
              <table border="0" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid ${block.color}; font-size: 1px; line-height: 1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
        `;
      default:
        return '';
    }
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f4f4; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              ${renderedBlocks}
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
          </td>
        </tr>
      </table>
    </body>
    </html>
  `.trim();
}
