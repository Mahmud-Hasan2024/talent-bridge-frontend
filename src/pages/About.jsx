const About = () => {
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

  const infoBoxStyle = {
    flex: 1,
    padding: '20px',
    border: `1px solid ${COLORS.secondaryGreen}`,
    borderRadius: '8px',
    backgroundColor: COLORS.lightBackground,
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>🌱 About Talent Bridge</h1>
      <p style={{ fontSize: '1.1em' }}>
        Talent Bridge is your premier job portal dedicated to connecting top companies with exceptional talent in Bangladesh. Our foundation is built on **innovation and reliability**.
      </p>
      
      <div style={{ borderTop: `1px solid ${COLORS.secondaryGreen}`, margin: '30px 0' }} />

      <h2 style={subHeadingStyle}>Our Core Values</h2>
      
      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Value Column 1 */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: COLORS.primaryGreen, fontSize: '1.4em' }}>Commitment to Growth</h3>
          <p>We facilitate professional growth for both employers and job seekers, focusing on long-term success rather than quick fixes.</p>
        </div>
        
        {/* Value Column 2 */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: COLORS.primaryGreen, fontSize: '1.4em' }}>Trust and Transparency</h3>
          <p>We maintain an open platform with clear communication throughout the job search and hiring process for all users.</p>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${COLORS.secondaryGreen}`, margin: '30px 0' }} />

      <h2 style={subHeadingStyle}>Connecting Opportunity</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={infoBoxStyle}>
          <h3 style={{ margin: '0 0 5px 0', color: COLORS.primaryGreen }}>For Employers</h3>
          <p style={{ fontSize: '0.95em' }}>Access a curated pool of qualified candidates efficiently.</p>
        </div>
        <div style={infoBoxStyle}>
          <h3 style={{ margin: '0 0 5px 0', color: COLORS.primaryGreen }}>For Job Seekers</h3>
          <p style={{ fontSize: '0.95em' }}>Find verified job listings and take the next step in your career journey.</p>
        </div>
      </div>
    </div>
  );
};

export default About;