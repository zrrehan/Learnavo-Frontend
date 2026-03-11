export default function Faq() {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: `Click the "Sign Up" button in the top right corner and follow the registration process.`,
    },
    {
      question: "I forgot my password. What should I do?",
      answer: `Click on "Forgot Password" on the login page and follow the instructions sent to your email.`,
    },
    {
      question: "How do I update my profile information?",
      answer: `Go to "My Account" settings and select "Edit Profile" to make changes.`,
    },
    {
      question: "How do I find the right tutor for me?",
      answer: `Use our smart search to filter tutors by subject, availability, and rating. You can also read reviews from other students before booking.`,
    },
    {
      question: "Can I cancel or reschedule a session?",
      answer: `Yes. You can cancel or reschedule up to 24 hours before your session from your dashboard with no penalty.`,
    },
    {
      question: "Is my payment information secure?",
      answer: `Absolutely. All transactions are encrypted and processed through a secure payment gateway. We never store your card details.`,
    },
  ];

  return (
    <section className="bg-white py-24 px-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-16">
        <p className="text-xs tracking-[0.3em] uppercase [font-family:monospace] text-black/40 mb-4">
          Support
        </p>
        <div className="flex items-end justify-between gap-6 border-b border-black/10 pb-8">
          <h2
            className="text-5xl font-black tracking-tight text-black leading-none [font-family:'Georgia',serif]"
          >
            Frequently <br />
            <span className="[font-family:'Georgia',serif] font-black" style={{WebkitTextStroke: "1.5px black", color: "transparent"}}>
              Asked.
            </span>
          </h2>
          <p className="text-sm text-black/50 max-w-xs text-right leading-relaxed hidden sm:block">
            Can't find your answer? Reach out to our support team anytime.
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto flex flex-col gap-0">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="collapse collapse-plus bg-white border-b border-black/10 rounded-none group"
          >
            <input
              type="radio"
              name="faq-accordion"
              defaultChecked={index === 0}
            />
            <div className="collapse-title font-semibold text-black text-base tracking-tight py-6 px-0 pr-10 group-hover:text-black/60 transition-colors duration-200 [font-family:'Georgia',serif]">
              <span className="text-black/20 [font-family:monospace] text-xs font-normal mr-4">
                {String(index + 1).padStart(2, "0")}
              </span>
              {faq.question}
            </div>
            <div className="collapse-content px-0">
              <p className="text-sm text-black/50 leading-relaxed pb-4 pl-10">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-3xl mx-auto mt-16 flex items-center justify-between border border-black/10 p-8">
        <div>
          <p className="font-black text-black [font-family:'Georgia',serif] text-lg">Still have questions?</p>
          <p className="text-sm text-black/40 mt-1">Our team is ready to help you out.</p>
        </div>
        <a className="btn btn-sm rounded-none border border-black bg-black text-white text-xs tracking-[0.15em] uppercase font-semibold hover:bg-white hover:text-black transition-all duration-300 [font-family:monospace] px-6">
          Contact Us
        </a>
      </div>
    </section>
  );
}