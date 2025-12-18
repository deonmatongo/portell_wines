// HTML Email Template Generator for Order Confirmation

export const createOrderEmailHTML = (orderData, language = 'pl') => {
  const t = {
    pl: {
      title: 'Potwierdzenie zamówienia',
      hello: 'Witaj',
      thankYou: 'Dziękujemy za zamówienie w Portell Winery!',
      orderNumber: 'Numer zamówienia',
      orderDetails: 'Szczegóły zamówienia',
      product: 'Produkt',
      quantity: 'Ilość',
      price: 'Cena',
      subtotal: 'Suma częściowa',
      shipping: 'Dostawa',
      shippingFee: 'Bezpłatna',
      total: 'Łącznie',
      shippingAddress: 'Adres dostawy',
      paymentMethod: 'Metoda płatności',
      nextSteps: 'Kolejne kroki',
      willProcess: 'Twoje zamówienie zostanie przetworzone w ciągu 1-2 dni roboczych',
      willNotify: 'Otrzymasz powiadomienie, gdy zamówienie zostanie wysłane',
      questions: 'W razie pytań, skontaktuj się z nami',
      thanks: 'Dziękujemy za zaufanie!',
      team: 'Zespół Portell',
      allRights: 'Wszelkie prawa zastrzeżone'
    },
    en: {
      title: 'Order Confirmation',
      hello: 'Hello',
      thankYou: 'Thank you for your order at Portell Winery!',
      orderNumber: 'Order Number',
      orderDetails: 'Order Details',
      product: 'Product',
      quantity: 'Quantity',
      price: 'Price',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      shippingFee: 'Free',
      total: 'Total',
      shippingAddress: 'Shipping Address',
      paymentMethod: 'Payment Method',
      nextSteps: 'Next Steps',
      willProcess: 'Your order will be processed within 1-2 business days',
      willNotify: "You'll receive a notification when your order ships",
      questions: 'If you have questions, please contact us',
      thanks: 'Thank you for your trust!',
      team: 'Portell Team',
      allRights: 'All rights reserved'
    }
  }[language];

  const itemsHTML = orderData.items.map(item => `
    <tr>
      <td style="padding: 15px 10px; border-bottom: 1px solid #f0f0f0; color: #2B2B2B; font-size: 15px;">${item.product_name}</td>
      <td style="padding: 15px 10px; text-align: center; border-bottom: 1px solid #f0f0f0; color: #666666; font-size: 15px;">${item.quantity}</td>
      <td style="padding: 15px 10px; text-align: right; border-bottom: 1px solid #f0f0f0; color: #2B2B2B; font-size: 15px;">${(item.price * item.quantity).toFixed(2)} PLN</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="${language}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${t.title}</title>
  <style>
    * { margin: 0; padding: 0; }
    body { margin: 0 !important; padding: 0 !important; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif; }
    table { border-collapse: collapse; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="margin: 0 auto; background-color: #ffffff; max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #5C2E2E 0%, #2B2B2B 100%); padding: 50px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 36px; font-weight: 300; letter-spacing: 0.3em; color: #ffffff; font-family: Arial, sans-serif;">PORTELL</h1>
              <p style="margin: 15px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.1em;">${t.title}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 400; color: #2B2B2B; font-family: Arial, sans-serif;">${t.hello} ${orderData.customer_name},</h2>
              <p style="margin: 0 0 35px 0; font-size: 16px; line-height: 1.6; color: #666666;">${t.thankYou}</p>

              <!-- Order Number Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td style="background-color: #f8f6f3; padding: 25px; text-align: center; border-radius: 8px;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 0.15em;">${t.orderNumber}</p>
                    <p style="margin: 0; font-size: 28px; font-family: 'Courier New', Courier, monospace; font-weight: 700; color: #5C2E2E; letter-spacing: 0.05em;">${orderData.order_number}</p>
                  </td>
                </tr>
              </table>

              <!-- Order Details -->
              <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #2B2B2B; font-family: Arial, sans-serif;">${t.orderDetails}</h3>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                <thead>
                  <tr>
                    <th style="padding: 12px 10px; text-align: left; font-size: 12px; color: #999999; text-transform: uppercase; border-bottom: 2px solid #e5e5e5; font-weight: 600;">${t.product}</th>
                    <th style="padding: 12px 10px; text-align: center; font-size: 12px; color: #999999; text-transform: uppercase; border-bottom: 2px solid #e5e5e5; font-weight: 600;">${t.quantity}</th>
                    <th style="padding: 12px 10px; text-align: right; font-size: 12px; color: #999999; text-transform: uppercase; border-bottom: 2px solid #e5e5e5; font-weight: 600;">${t.price}</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <!-- Totals -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td style="padding: 10px; text-align: right; color: #666666; font-size: 15px;">${t.subtotal}:</td>
                  <td style="padding: 10px; text-align: right; width: 130px; color: #2B2B2B; font-weight: 600; font-size: 15px;">${orderData.subtotal.toFixed(2)} PLN</td>
                </tr>
                <tr>
                  <td style="padding: 10px; text-align: right; color: #666666; font-size: 15px;">${t.shipping}:</td>
                  <td style="padding: 10px; text-align: right; color: #22c55e; font-weight: 600; font-size: 15px;">${t.shippingFee}</td>
                </tr>
                <tr>
                  <td style="padding: 15px 10px 0 10px; text-align: right; border-top: 2px solid #e5e5e5; font-size: 18px; font-weight: 700; color: #2B2B2B;">${t.total}:</td>
                  <td style="padding: 15px 10px 0 10px; text-align: right; border-top: 2px solid #e5e5e5; font-size: 18px; font-weight: 700; color: #5C2E2E;">${orderData.total.toFixed(2)} PLN</td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <div style="margin-bottom: 30px;">
                <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #2B2B2B; text-transform: uppercase; letter-spacing: 0.05em;">${t.shippingAddress}</h4>
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #666666;">
                  ${orderData.shipping_address.street}<br>
                  ${orderData.shipping_address.postal_code} ${orderData.shipping_address.city}<br>
                  ${orderData.shipping_address.country}
                </p>
              </div>

              <!-- Payment Method -->
              <div style="margin-bottom: 35px;">
                <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #2B2B2B; text-transform: uppercase; letter-spacing: 0.05em;">${t.paymentMethod}</h4>
                <p style="margin: 0; font-size: 15px; color: #666666;">${orderData.payment_method}</p>
              </div>

              <!-- Next Steps -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                <tr>
                  <td style="background-color: #f8f6f3; padding: 25px; border-radius: 6px;">
                    <h4 style="margin: 0 0 15px 0; font-size: 17px; font-weight: 600; color: #2B2B2B;">${t.nextSteps}</h4>
                    <p style="margin: 0 0 10px 0; font-size: 15px; line-height: 1.6; color: #666666;">✓ ${t.willProcess}</p>
                    <p style="margin: 0 0 10px 0; font-size: 15px; line-height: 1.6; color: #666666;">✓ ${t.willNotify}</p>
                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #666666;">✓ ${t.questions}</p>
                  </td>
                </tr>
              </table>

              <!-- Contact -->
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #666666; text-align: center;">
                <a href="mailto:kontakt@portell.wine" style="color: #5C2E2E; text-decoration: none;">kontakt@portell.wine</a> • 
                <a href="https://www.portell.wine" style="color: #5C2E2E; text-decoration: none;">www.portell.wine</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f6f3; padding: 35px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; font-size: 16px; color: #2B2B2B; font-weight: 500;">${t.thanks}</p>
              <p style="margin: 0; font-size: 15px; color: #666666;">${t.team}</p>
            </td>
          </tr>
        </table>

        <!-- Footer Text -->
        <p style="margin: 25px 0 0 0; text-align: center; font-size: 12px; color: #999999;">
          © ${new Date().getFullYear()} Portell Winery • ${t.allRights}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
};