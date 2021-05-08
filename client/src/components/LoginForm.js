import React, { useState } from "react";

import { LOGIN_USER } from "../utils/mutations";
import { useMutation } from "@apollo/react-hooks";

import { Form, Button, Alert } from "react-bootstrap";
import Auth from "../utils/auth";

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ email: "", password: "" });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [loginUser ] = useMutation(LOGIN_USER);
// Added login user mutation
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
// Refactored this section to work with mutation
        try {
            const { data } = await loginUser({
                variables: { ...userFormData }
            });
            
            Auth.login(data.login.token);
        } catch (err) {
            console.error(err);
            setShowAlert(true);
        }

        setUserFormData({
            username: "",
            email: "",
            password: "",
        });
    };

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
                    There was an error with what you entered!
                </Alert>
                <Form.Group>
                    <Form.Label htmlFor="email">E-mail: </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Your e-mail"
                        name="email"
                        onChange={handleInputChange}
                        value={userFormData.email}
                        required
                    />
                    <Form.Control.Feedback type="invalid">Please enter an e-mail...</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="password">Password: </Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Your password"
                        name="password"
                        onChange={handleInputChange}
                        value={userFormData.password}
                        required
                    />
                    <Form.Control.Feedback type="invalid">Please enter a password...</Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={!(userFormData.email && userFormData.password)}
                    type="submit"
                    variant="success">
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default LoginForm;
