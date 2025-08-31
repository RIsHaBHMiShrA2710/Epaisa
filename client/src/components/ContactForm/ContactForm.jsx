import { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import classes from './ContactForm.module.css';
import axios from 'axios';
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
  const [touched, setTouched] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const BACKEND = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000'
  : import.meta.env.VITE_BACKEND_URL;
  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setShowSuccessModal(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation for better UX
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleFocus = (name) => {
    setFocusedInputs(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name, value) => {
    setFocusedInputs(prev => ({ ...prev, [name]: value.trim() !== '' }));
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!emailRegex.test(value)) {
          error = 'Enter a valid email address';
        }
        break;
      case 'phone':
        const phoneRegex = /^\d{10}$/;
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!phoneRegex.test(value.replace(/\D/g, ''))) {
          error = 'Phone must be 10 digits';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const validate = () => {
    const fields = ['name', 'email', 'phone', 'message'];
    let isValid = true;
    
    fields.forEach(field => {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    });
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, phone: true, message: true });
    
    if (!validate()) {
      // Focus first error field for better UX
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      }
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(`${BACKEND}/api/contact`, formData);

      setSuccess(true);
      setShowSuccessModal(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setFocusedInputs({ name: false, email: false, phone: false, message: false });
      setTouched({});
      setErrors({});
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (field) => {
    let classNames = [classes.formInput];
    if (errors[field]) classNames.push(classes.error);
    else if ((focusedInputs[field] || formData[field]) && touched[field]) classNames.push(classes.success);
    else if (focusedInputs[field]) classNames.push(classes.focused);
    return classNames.join(' ');
  };

  const contactInfo = [
    { 
      icon: MapPin, 
      text: '7 MM Feeder Road, Kolkata, India', 
      color: 'emerald',
      link: 'https://maps.google.com/?q=7+MM+Feeder+Road+Kolkata+India' 
    },
    { 
      icon: Mail, 
      text: '1234mshubham@gmail.com', 
      color: 'blue',
      link: 'mailto:1234mshubham@gmail.com'
    },
    { 
      icon: Phone, 
      text: '+91 9903373388', 
      color: 'purple',
      link: 'tel:+919903373388'
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'facebook', label: 'Facebook' },
    { icon: Twitter, href: '#', color: 'twitter', label: 'Twitter' },
    { icon: Instagram, href: '#', color: 'instagram', label: 'Instagram' },
    { icon: Linkedin, href: '#', color: 'linkedin', label: 'LinkedIn' }
  ];

  return (
    <div className={classes.contactContainer}>
      {/* Animated Background Elements */}
      <div className={classes.bgDecorations}>
        <div className={`${classes.bgCircle} ${classes.bgCircle1}`}></div>
        <div className={`${classes.bgCircle} ${classes.bgCircle2}`}></div>
        <div className={`${classes.bgCircle} ${classes.bgCircle3}`}></div>
        <div className={`${classes.bgCircle} ${classes.bgCircle4}`}></div>
        <div className={`${classes.bgSquare} ${classes.bgSquare1}`}></div>
        <div className={`${classes.bgSquare} ${classes.bgSquare2}`}></div>
      </div>

      <div className={classes.contactWrapper}>
        <div className={classes.contactCard}>
          
          {/* Contact Information Section */}
          <div className={classes.contactInfoSection}>
            <div className={classes.infoDecorations}>
              <div className={classes.infoDecoration1}></div>
              <div className={classes.infoDecoration2}></div>
            </div>
            
            <div className={classes.contactInfoContent}>
              <div className={classes.contactHeader}>
                <h2 className={classes.contactTitle}>
                  Let's get in
                  <span className={classes.contactTitleAccent}>touch</span>
                </h2>
                <p className={classes.contactSubtitle}>
                  Ready to bring your ideas to life? We'd love to hear from you. 
                  Drop us a message and let's create something amazing together.
                </p>
              </div>

              <div className={classes.contactDetails}>
                {contactInfo.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.link}
                    className={`${classes.contactDetailItem} ${classes[item.color]}`}
                    target={item.link.startsWith('http') ? '_blank' : '_self'}
                    rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    <div className={classes.contactIconWrapper}>
                      <item.icon className={classes.contactIcon} />
                    </div>
                    <p className={classes.contactText}>{item.text}</p>
                  </a>
                ))}
              </div>

              <div className={classes.socialSection}>
                <p className={classes.socialLabel}>Connect with us</p>
                <div className={classes.socialLinks}>
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`${classes.socialLink} ${classes[social.color]}`}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className={classes.socialIcon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className={classes.contactFormSection}>
            <div className={classes.formDecorations}>
              <div className={classes.formDecoration1}></div>
            </div>
            
            <div className={classes.contactFormContent}>
              <div className={classes.formHeader}>
                <h3 className={classes.formTitle}>Send us a message</h3>
                <p className={classes.formSubtitle}>We'll get back to you within 24 hours</p>
              </div>

              <div className={classes.contactForm}>
                {['name', 'email', 'phone', 'message'].map((field) => (
                  <div key={field} className={classes.inputGroup}>
                    <div className={`${classes.inputWrapper} ${field === 'message' ? classes.textareaWrapper : ''}`}>
                      {field === 'message' ? (
                        <textarea
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          onFocus={() => handleFocus(field)}
                          onBlur={(e) => handleBlur(field, e.target.value)}
                          className={getInputClassName(field)}
                          rows="5"
                        />
                      ) : (
                        <input
                          type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          onFocus={() => handleFocus(field)}
                          onBlur={(e) => handleBlur(field, e.target.value)}
                          className={getInputClassName(field)}
                        />
                      )}
                      
                      <label className={`${classes.inputLabel} ${
                        focusedInputs[field] || formData[field] ? classes.labelFloat : ''
                      }`}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>

                      <div className={classes.inputBorderEffect}></div>
                    </div>
                    
                    {errors[field] && (
                      <div className={classes.errorMessage}>
                        <AlertCircle className={classes.errorIcon} />
                        <span>{errors[field]}</span>
                      </div>
                    )}
                  </div>
                ))}

                {errors.submit && (
                  <div className={classes.submitError}>
                    <AlertCircle className={classes.errorIcon} />
                    <span>{errors.submit}</span>
                  </div>
                )}

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`${classes.submitBtn} ${loading ? classes.loading : ''}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className={`${classes.btnIcon} ${classes.spinning}`} />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className={classes.btnIcon} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {success && !showSuccessModal && (
                  <div className={classes.successMessage}>
                    <CheckCircle className={classes.successIcon} />
                    <p>Your message was sent successfully! We'll get back to you soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={classes.modalOverlay} onClick={() => setShowSuccessModal(false)}>
          <div className={classes.successModal} onClick={(e) => e.stopPropagation()}>
            <button 
              className={classes.modalClose}
              onClick={() => setShowSuccessModal(false)}
              aria-label="Close modal"
            >
              <X className={classes.closeIcon} />
            </button>
            <div className={classes.modalContent}>
              <div className={classes.successIconLarge}>
                <CheckCircle className={classes.successCheck} />
              </div>
              <h3 className={classes.modalTitle}>Message Sent Successfully!</h3>
              <p className={classes.modalText}>
                Thank you for reaching out. We've received your message and will get back to you within 24 hours.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactForm;