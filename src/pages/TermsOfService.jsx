const TermsOfService = () => {
  const COLORS = {
    primaryGreen: '#388E3C',
    secondaryGreen: '#A5D6A7',
    darkText: '#212121',
    lightBackground: '#f7fcf7',
    white: '#FFFFFF',
  };
  
  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
    color: COLORS.darkText,
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6
  };

  const headingStyle = {
    color: COLORS.primaryGreen,
    fontSize: '2.5em',
    fontWeight: 700,
    marginBottom: '0.5em',
    paddingBottom: '10px',
    borderBottom: `3px solid ${COLORS.secondaryGreen}`,
  };

  const subHeadingStyle = {
    color: COLORS.primaryGreen,
    fontSize: '1.8em',
    marginTop: '2em',
    marginBottom: '0.8em',
  };
  
  const h3Style = {
      color: COLORS.primaryGreen, 
      fontSize: '1.4em'
  };

  const paragraphStyle = {
    fontSize: '1.1em',
    marginBottom: '1em',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>⚖️ Terms of Service</h1>
      <p style={paragraphStyle}><strong>Last Updated:</strong> November 20, 2025</p>
      <p style={paragraphStyle}>
        Welcome to **Talent Bridge**. By using our service, you agree to be bound by these Terms.
      </p>

      <div style={{ borderTop: `1px solid ${COLORS.secondaryGreen}`, margin: '30px 0' }} />

      <h2 style={subHeadingStyle}>1. Acceptance and Agreement</h2>
      <p style={paragraphStyle}>
        Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. If you disagree with any part, you must not use the Service.
      </p>

      <h2 style={subHeadingStyle}>2. Account Registration and Use</h2>
      
      <h3 style={h3Style}>2.1. User Responsibilities</h3>
      <p style={paragraphStyle}>
        You must ensure all information provided (for jobs or resumes) is accurate, current, and truthful.
      </p>

      <h3 style={h3Style}>2.2. Prohibited Content</h3>
      <p style={paragraphStyle}>
        You agree not to post fraudulent, misleading, offensive, or harmful content. We reserve the right to remove any content that violates these rules without prior notice.
      </p>

      <h2 style={subHeadingStyle}>3. Limitation of Liability</h2>
      <p style={paragraphStyle}>
        Talent Bridge is an intermediary platform and is not liable for the conduct of any users or the suitability of any job or candidate found through the service.
      </p>
      
      <div style={{ borderTop: `1px solid ${COLORS.secondaryGreen}`, margin: '30px 0' }} />

      <p style={paragraphStyle}>Thank you for using Talent Bridge. If you have any questions, please contact our support team.</p>
    </div>
  );
};

export default TermsOfService;