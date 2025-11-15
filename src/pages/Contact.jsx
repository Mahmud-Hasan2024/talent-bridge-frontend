const Contact = () => {
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

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: `1px solid ${COLORS.secondaryGreen}`,
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '1em'
  };

  const btnStyle = {
    padding: '12px 25px',
    backgroundColor: COLORS.primaryGreen,
    color: COLORS.white,
    border: 'none',
    borderRadius: '6px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! (Implement your API call here)');
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>👋 Get In Touch</h1>
      <p style={{ fontSize: '1.1em' }}>
        We're here to help you bridge the gap! For support or inquiries, please use the form below.
      </p>
      
      <div style={{ borderTop: `1px solid ${COLORS.secondaryGreen}`, margin: '30px 0' }} />

      <h2 style={subHeadingStyle}>Send Us a Message</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
        <label style={{ display: 'block', margin: '15px 0 5px', fontWeight: 'bold', color: COLORS.primaryGreen }} htmlFor="name">Your Name</label>
        <input style={inputStyle} type="text" id="name" name="name" required />

        <label style={{ display: 'block', margin: '15px 0 5px', fontWeight: 'bold', color: COLORS.primaryGreen }} htmlFor="email">Your Email</label>
        <input style={inputStyle} type="email" id="email" name="email" required />

        <label style={{ display: 'block', margin: '15px 0 5px', fontWeight: 'bold', color: COLORS.primaryGreen }} htmlFor="message">Your Message</label>
        <textarea style={{...inputStyle, resize: 'vertical'}} id="message" name="message" rows="6" required></textarea>

        <button 
          type="submit" 
          style={btnStyle}
        >
          Send Message
        </button>
      </form>

      <div style={{ borderTop: `1px solid ${COLORS.secondaryGreen}`, margin: '30px 0' }} />

      <h2 style={subHeadingStyle}>Key Contact Information</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '30px' }}>
        <div style={infoBoxStyle}>
          <h3 style={{ color: COLORS.primaryGreen, marginTop: 0 }}>General Inquiries</h3>
          <p style={{ margin: 0, fontSize: '1em' }}>📧 info@talentbridgebd.com</p>
        </div>
        <div style={infoBoxStyle}>
          <h3 style={{ color: COLORS.primaryGreen, marginTop: 0 }}>Support Hotline</h3>
          <p style={{ margin: 0, fontSize: '1em' }}>📞 +880 1XXXXXXXXX</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;