import React, { useState } from "react";

import { useMutation } from "@apollo/react-hooks";
import { ADD_USER } from "../utils/mutations";

import { Form, Button, Alert } from "react-bootstrap";
import Auth from "../utils/auth";

const SignupForm = () => {
    const [userFormData, setUserFormData] = useState({ username: "", email: "", password: "" });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [createUser] = useMutation(ADD_USER);

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

        try {
            const { data } = await createUser({
                variables: { ...userFormData }
            });
            
            Auth.login(data.addUser.token);
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
            {/* This is needed for the validation functionality above */}
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                {/* show alert if server response is bad */}
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
                    There was an error with your signup!
                </Alert>

                <Form.Group>
                    <Form.Label htmlFor="username">Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Your username"
                        name="username"
                        onChange={handleInputChange}
                        value={userFormData.username}
                        required
                    />
                    <Form.Control.Feedback type="invalid">Please enter username</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="email">E-mail</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Your email address"
                        name="email"
                        onChange={handleInputChange}
                        value={userFormData.email}
                        required
                    />
                    <Form.Control.Feedback type="invalid">Please enter e-mail</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Your password"
                        name="password"
                        onChange={handleInputChange}
                        value={userFormData.password}
                        required
                    />
                    <Form.Control.Feedback type="invalid">Please enter password</Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={!(userFormData.username && userFormData.email && userFormData.password)}
                    type="submit"
                    variant="success">
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default SignupForm;
