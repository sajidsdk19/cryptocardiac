import React, { useState } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { Helmet } from 'react-helmet-async';

const contactEmail = 'support@cryptocardiac.com';

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '1rem',
    fontFamily: 'Inter, sans-serif',
};

const InfoCard = ({ label, value, href }) => (
    <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
    }}>
        <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }}>{label}</div>
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA', fontSize: '0.9rem', textDecoration: 'none' }}>{value}</a>
    </div>
);

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const mailTo = `mailto:${contactEmail}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
        window.location.href = mailTo;
        setSubmitted(true);
    };

    return (
        <>
            <Helmet>
                <title>Contact CryptoCardiac | Get in Touch with Our Team</title>
                <meta name="description" content="Contact CryptoCardiac for support, corrections, privacy questions, editorial feedback, or platform inquiries. Reach the publisher at support@cryptocardiac.com." />
                <meta name="keywords" content="contact cryptocardiac, crypto support, cryptocurrency voting contact, crypto platform help" />
                <link rel="canonical" href="https://cryptocardiac.com/contact" />
            </Helmet>
            <Navbar />
            <div style={{
                minHeight: '100vh',
                background: 'rgb(21,21,32)',
                color: '#ccc',
                padding: '60px 20px',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8',
            }}>
                <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Contact Us</h1>
                        <p style={{ color: '#888' }}>Questions, corrections, privacy requests, editorial feedback, and platform inquiries can be sent directly to the CryptoCardiac team.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                        <InfoCard label="Email" value={contactEmail} href={`mailto:${contactEmail}`} />
                        <InfoCard label="Website" value="cryptocardiac.com" href="https://cryptocardiac.com" />
                        <InfoCard label="Publisher" value="CryptoCardiac" href="https://cryptocardiac.com/about" />
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '28px',
                        marginBottom: '2rem',
                    }}>
                        <h2 style={{ color: '#fff', marginBottom: '0.75rem', fontSize: '1.25rem' }}>Publisher and Support Details</h2>
                        <p style={{ color: '#aaa', marginBottom: '0.75rem' }}>
                            CryptoCardiac is operated as a public cryptocurrency education and community-voting website. The platform publishes educational articles, voting methodology notes, and public leaderboard data for informational use.
                        </p>
                        <p style={{ color: '#aaa', marginBottom: '0.75rem' }}>
                            For corrections, copyright concerns, privacy requests, account questions, or advertising-policy issues, email <a href={`mailto:${contactEmail}`} style={{ color: '#CE34EA' }}>{contactEmail}</a>.
                        </p>
                        <p style={{ color: '#888', fontSize: '0.92rem' }}>
                            CryptoCardiac does not provide personal financial, legal, tax, or investment advice.
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '32px',
                    }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Send a Message</h2>
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem', color: '#CE34EA' }}>Message ready</div>
                                <p style={{ color: '#fff', fontSize: '1.1rem' }}>Your mail client has been opened.</p>
                                <p style={{ color: '#888' }}>We will reply to <strong style={{ color: '#CE34EA' }}>{form.email}</strong> as soon as possible.</p>
                                <button onClick={() => setSubmitted(false)} style={{ marginTop: '1.5rem', padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #5700F9, #CE34EA)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '4px' }}>Your Name *</label>
                                        <input style={inputStyle} name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                                        <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                                    </div>
                                </div>
                                <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '4px' }}>Subject *</label>
                                <input style={inputStyle} name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" required />
                                <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '4px' }}>Message *</label>
                                <textarea
                                    style={{ ...inputStyle, height: '140px', resize: 'vertical' }}
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Include the relevant page URL, account email, or article title if your request is about a specific issue."
                                    required
                                />
                                <button type="submit" style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #5700F9 0%, #CE34EA 100%)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    marginTop: '0.5rem',
                                }}>
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Contact;
