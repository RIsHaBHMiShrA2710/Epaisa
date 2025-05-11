import { useState } from 'react';
import { Container, Button } from '@mantine/core';
import { IconMail, IconDeviceMobile, IconMapPin } from '@tabler/icons-react';
import {
  IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin,
} from '@tabler/icons-react';
import classes from './ContactForm.module.css';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
export function ContactForm() {
  const [focusedInputs, setFocusedInputs] = useState({
    name: false, email: false, phone: false, message: false,
  });
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const BACKEND = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000'
  : import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFocus = (name) => {
    setFocusedInputs(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name, value) => {
    setFocusedInputs(prev => ({ ...prev, [name]: value.trim() !== '' }));
  };

  const validate = () => {
    const err = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) err.name = 'Name is required';
    if (!emailRegex.test(formData.email)) err.email = 'Enter a valid email';
    if (!/^\d{10}$/.test(formData.phone)) err.phone = 'Phone must be 10 digits';
    if (!formData.message.trim()) err.message = 'Message is required';

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND}/api/contact`, formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={classes.container}>
      {/* Contact Info Section */}
      <div className={classes.form}>
        <div className={classes.contactInfo}>
          <h3 className={classes.title}>Let's get in touch</h3>
          <p className={classes.text}>Feel free to reach out anytime.</p>
          <div className={classes.info}>
            <div className={classes.information}><IconMapPin /><p>7 MM Feeder Road, Kolkata, India</p></div>
            <div className={classes.information}><IconMail /><p>1234mshubham@gmail.com</p></div>
            <div className={classes.information}><IconDeviceMobile /><p>+91 9903373388</p></div>
          </div>
          <div className={classes.socialMedia}>
            <p>Connect with us :</p>
            <div className={classes.socialIcons}>
              <a href="#"><IconBrandFacebook /></a>
              <a href="#"><IconBrandTwitter /></a>
              <a href="#"><IconBrandInstagram /></a>
              <a href="#"><IconBrandLinkedin /></a>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className={classes.contactForm}>
          <form onSubmit={handleSubmit}>
            <h3 className={classes.title}>Contact us</h3>

            {['name', 'email', 'phone', 'message'].map((field) => (
              <div
                key={field}
                className={`${classes.inputContainer} ${field === 'message' ? classes.textarea : ''} ${focusedInputs[field] ? classes.focus : ''}`}
              >
                {field === 'message' ? (
                  <textarea
                    className={classes.input}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onFocus={() => handleFocus(field)}
                    onBlur={(e) => handleBlur(field, e.target.value)}
                  />
                ) : (
                  <input
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    className={classes.input}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onFocus={() => handleFocus(field)}
                    onBlur={(e) => handleBlur(field, e.target.value)}
                   
                  />
                )}
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                {errors[field] && <small className={classes.errorText}>{errors[field]}</small>}
              </div>
            ))}

            <Button type="submit" className={classes.btn} disabled={loading}>
              {loading ? <LoadingSpinner/> : 'Send'}
            </Button>
            {success && <p className={classes.successText}>Your message was sent successfully!</p>}
          </form>
        </div>
      </div>
    </Container>
  );
}

export default ContactForm;
