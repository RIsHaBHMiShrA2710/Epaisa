import { useState } from 'react';
import { Container, TextInput, Textarea, Button } from '@mantine/core';
import { IconMail, IconDeviceMobile, IconMapPin } from '@tabler/icons-react';

import {
    IconBrandFacebook,
    IconBrandTwitter,
    IconBrandInstagram,
    IconBrandLinkedin,
} from '@tabler/icons-react';
import classes from './ContactForm.module.css';

export function ContactForm() {
    const [focusedInputs, setFocusedInputs] = useState({
        name: false,
        email: false,
        phone: false,
        message: false,
    });

    const handleFocus = (name) => {
        setFocusedInputs(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const handleBlur = (name, value) => {
        setFocusedInputs(prev => ({
            ...prev,
            [name]: value.trim() !== ''
        }));
    };

    return (
        <Container className={classes.container}>
            <span className={classes.bigCircle}></span>
            <div className={classes.square}></div>
            <div className={classes.form}>
                <div className={classes.contactInfo}>
                    <h3 className={classes.title}>Let's get in touch</h3>
                    <p className={classes.text}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
                        dolorum adipisci recusandae praesentium dicta!
                    </p>

                    <div className={classes.info}>
                        <div className={classes.information}>
                            <IconMapPin className={classes.icon} />
                            <p>92 Cherry Drive Uniondale, NY 11553</p>
                        </div>
                        <div className={classes.information}>
                            <IconMail className={classes.icon} />
                            <p>lorem@ipsum.com</p>
                        </div>
                        <div className={classes.information}>
                            <IconDeviceMobile className={classes.icon} />
                            <p>123-456-789</p>
                        </div>

                    </div>

                    <div className={classes.socialMedia}>
                        <p>Connect with us :</p>
                        <div className={classes.socialIcons}>
                            <a href="#" aria-label="Facebook">
                                <IconBrandFacebook size={16} />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <IconBrandTwitter size={16} />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <IconBrandInstagram size={16} />
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <IconBrandLinkedin size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={classes.contactForm}>
                    <span className={`${classes.circle} ${classes.one}`}></span>
                    <span className={`${classes.circle} ${classes.two}`}></span>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <h3 className={classes.title}>Contact us</h3>

                        <div className={`${classes.inputContainer} ${focusedInputs.name ? classes.focus : ''}`}>
                            <input
                                type="text"
                                className={classes.input}
                                onFocus={() => handleFocus('name')}
                                onBlur={(e) => handleBlur('name', e.target.value)}
                            />
                            <label>Username</label>
                            <span>Username</span>
                        </div>

                        <div className={`${classes.inputContainer} ${focusedInputs.email ? classes.focus : ''}`}>
                            <input
                                type="email"
                                className={classes.input}
                                onFocus={() => handleFocus('email')}
                                onBlur={(e) => handleBlur('email', e.target.value)}
                            />
                            <label>Email</label>
                            <span>Email</span>
                        </div>

                        <div className={`${classes.inputContainer} ${focusedInputs.phone ? classes.focus : ''}`}>
                            <input
                                type="tel"
                                className={classes.input}
                                onFocus={() => handleFocus('phone')}
                                onBlur={(e) => handleBlur('phone', e.target.value)}
                            />
                            <label>Phone</label>
                            <span>Phone</span>
                        </div>

                        <div className={`${classes.inputContainer} ${classes.textarea} ${focusedInputs.message ? classes.focus : ''}`}>
                            <textarea
                                className={classes.input}
                                onFocus={() => handleFocus('message')}
                                onBlur={(e) => handleBlur('message', e.target.value)}
                            ></textarea>
                            <label>Message</label>
                            <span>Message</span>
                        </div>

                        <Button type="submit" className={classes.btn}>
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </Container>
    );
}

export default ContactForm;