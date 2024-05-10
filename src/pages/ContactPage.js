import { useState } from "react";
import emailjs from 'emailjs-com';

export default function ContactPage(){
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
    
        try {
            const response = await emailjs.sendForm(
                'service_15erxhg', // Replace with your EmailJS service ID
                'template_pazea98', // Replace with your EmailJS template ID
                event.target,
                '9VBB4hWv2XRjmRwZP' // Replace with your EmailJS user ID
            );
            setSuccessMessage('Your message has been sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            setSuccessMessage('There was an error sending your message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
        <h1>Send me feedback!</h1>
        <p>Message:</p>
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <textarea
                    name="message"
                    id="message"
                    cols="30"
                    rows="10"
                    value={formData.message}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
        </>
    );
}