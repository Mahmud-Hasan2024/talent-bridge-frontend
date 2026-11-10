const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14 text-base-content">
      <div className="border-b border-base-300 pb-6 mb-8">
        <h1 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">
          ⚖️ Terms of Service
        </h1>
        <p className="text-sm text-base-content/60">
          <strong>Last Updated:</strong> November 20, 2025
        </p>
      </div>

      <div className="space-y-8 leading-relaxed text-base-content/80">
        <p className="text-lg">
          Welcome to{" "}
          <strong className="text-base-content">Talent Bridge</strong>. By using
          our service, you agree to be bound by these Terms.
        </p>

        <section className="card bg-base-100 border border-base-300 p-6 rounded-2xl space-y-2">
          <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            1. Acceptance and Agreement
          </h2>
          <p>
            Your access to and use of the Service is conditioned upon your
            acceptance of and compliance with these Terms. If you disagree with
            any part, you must not use the Service.
          </p>
        </section>

        <section className="card bg-base-100 border border-base-300 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            2. Account Registration and Use
          </h2>
          <div>
            <h3 className="font-bold text-base-content">
              2.1. User Responsibilities
            </h3>
            <p>
              You must ensure all information provided (for jobs or resumes) is
              accurate, current, and truthful.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-base-content">
              2.2. Prohibited Content
            </h3>
            <p>
              You agree not to post fraudulent, misleading, offensive, or
              harmful content. We reserve the right to remove any content that
              violates these rules without prior notice.
            </p>
          </div>
        </section>

        <section className="card bg-base-100 border border-base-300 p-6 rounded-2xl space-y-2">
          <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            3. Limitation of Liability
          </h2>
          <p>
            Talent Bridge is an intermediary platform and is not liable for the
            conduct of any users or the suitability of any job or candidate
            found through the service.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
