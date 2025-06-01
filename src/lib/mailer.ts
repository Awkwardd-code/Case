import nodemailer from 'nodemailer'

export async function sendOrderEmail({
  to,
  orderId,
  orderDate,
  shippingAddress,
}: {
  to: string
  orderId: string
  orderDate: string
  shippingAddress: {
    name: string
    city: string
    country: string
    postalCode: string
    street: string
    state?: string
  }
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = `
    <h2>Thank you for your order!</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Order Date:</strong> ${orderDate}</p>
    <h3>Shipping Address:</h3>
    <p>
      ${shippingAddress.name}<br/>
      ${shippingAddress.street}, ${shippingAddress.city}<br/>
      ${shippingAddress.state ? `${shippingAddress.state}, ` : ''}${shippingAddress.postalCode}<br/>
      ${shippingAddress.country}
    </p>
  `

  await transporter.sendMail({
    from: `"CaseCobra" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Thanks for your order!',
    html,
  })
}
