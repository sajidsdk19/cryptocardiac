import React, { useState } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

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

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Opens the user's mail client with pre-filled details
        const mailTo = `mailto:support@cryptocardiac.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
        window.location.href = mailTo;
        setSubmitted(true);
    };

    return (
        <>
            <Navbar />
            <div style={{
                minHeight: '100vh',
                background: 'rgb(21,21,32)',
                color: '#ccc',
                padding: '60px 20px',
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.8',
            }}>
                <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '0.5rem' }}>Contact Us</h1>
                        <p style={{ color: '#888' }}>Have a question, feedback, or partnership inquiry? We'd love to hear from you.</p>
                    </div>

                    {/* Info Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '2.5rem' }}>
                        {[
                            { icon: '📧', label: 'Email', value: 'support@cryptocardiac.com', href: 'mailto:support@cryptocardiac.com' },
                            { icon: '🌐', label: 'Website', value: 'cryptocardiac.com', href: 'https://cryptocardiac.com' },
                            { icon: '🏢', label: 'Developed by', value: 'Raul & Sajid Khan', href: 'https://sajidkhan.me' },
                        ].map((item) => (
                            <div key={item.label} style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{item.icon}</div>
                                <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '4px' }}>{item.label}</div>
                                <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: '#CE34EA', fontSize: '0.9rem', textDecoration: 'none' }}>{item.value}</a>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '32px',
                    }}>
                        <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Send a Message</h2>
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                <p style={{ color: '#fff', fontSize: '1.1rem' }}>Your mail client has been opened!</p>
                                <p style={{ color: '#888' }}>We'll get back to you at <strong style={{ color: '#CE34EA' }}>{form.email}</strong> as soon as possible.</p>
                                <button onClick={() => setSubmitted(false)} style={{ marginTop: '1.5rem', padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #5700F9, #CE34EA)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '4px' }}>Your Name *</label>
                                        <input style={inputStyle} name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                                        <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
                                    </div>
                                </div>
                                <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '4px' }}>Subject *</label>
                                <input style={inputStyle} name="subject" value={form.subject} onChange={handleChange} placeholder="Your subject..." required />
                                <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '4px' }}>Message *</label>
                                <textarea
                                    style={{ ...inputStyle, height: '140px', resize: 'vertical' }}
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Tell us how we can help..."
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
                                    Send Message →
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
