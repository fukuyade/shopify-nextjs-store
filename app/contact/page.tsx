import ContactForm from '@/components/sections/ContactForm';

export const metadata = {
  title: 'お問い合わせ',
  description: 'DRIFT SPORTSへのお問い合わせはこちらから。',
};

export default function ContactPage() {
  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">お問い合わせ</h1>
      <p className="text-sm text-gray-500 mb-8">
        商品やご注文についてのご質問は、こちらのフォームからお気軽にどうぞ。
      </p>
      <ContactForm />
    </section>
  );
}
