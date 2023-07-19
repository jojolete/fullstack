import React, { useState } from 'react';
import {Form, Button} from "react-bootstrap";
import { useUserActions } from "../../hooks/user.actions";

function LoginForm(){

    const [validated, setValidated] = useState(false);
    const [form,  setForm]  = useState({});
    const [error, setError] = useState(null);
    const userActions = useUserActions();

    const handleSubmit = (event) => {
        event.preventDefault();
        const LoginForm = event.currentTarget;
        if (LoginForm.checkValidity()===false) {
            event.stopPropagation();
        }
        setValidated(true);
        const data = {
            email: form.email,
            password: form.password,
        };

        userActions.login(data)
            .catch((err) => {
                if (err.message) {
                    setError(err.request.response);
                }
            })
        }
        return(
            <Form 
                id='registration-form'
                className='border p-4 rounded'
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                data-testid = "login-form"
                >
                <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        value={form.email}
                        data-testid ="username-field"
                        onChange={(e) => setForm({
                            ...form, email:e.target.value
                        })}
                        required
                        type='text'
                        placeholder='Enter email'
                    />
                    <Form.Control.Feedback type='invalid'>
                        This file is required
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label> Password </Form.Label>
                    <Form.Control
                        value={form.password}
                        data-testid ="password-field"
                        minLength={"6"}
                        onChange={(e) => setForm({
                            ...form, password:e.target.value
                        })}
                        required
                        type='password'
                        placeholder="Password idiot"
                    />
                    <Form.Control.Feedback type='invalid'>
                        Please provide a valid password
                    </Form.Control.Feedback>
                </Form.Group>
                <div className='text-content text-danger'>
                    {error && <p> {error}</p>}
                </div>
                <Button variant="primary" type='submit'>
                    Submit mofo
                </Button>
            </Form>
        );

    
}

export default LoginForm;