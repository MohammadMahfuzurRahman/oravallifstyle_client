export default function WhatsAppButton() {
  const n = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const href = `https://wa.me/${n || ''}?text=${encodeURIComponent('Hello Oravel Lifestyle, I need help with an order.')}`;
  return <a className="wa" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">💬</a>;
}
