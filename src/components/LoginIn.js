import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword } from 'firebase/auth';
import '../styles/styles.css';

const { Title, Text } = Typography;

const LogIn = () => {
  const [form] = Form.useForm();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success("Login Successfully");
      form.resetFields();
      navigate('/dashboard'); // Assuming '/dashboard' is the landing page after login
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        message.error('Wrong password entered.');
      } else if (err.code === 'auth/user-not-found') {
        message.error('No user found with this email.');
      } else {
        message.error('Login failed. Please try again.');
      }
    }
  };

  const handleForgotPassword = async (values) => {
    const { email } = values;
    try {
      await sendPasswordResetEmail(auth, email);
      message.success('Password reset email sent. Check your inbox.');
    } catch (err) {
      console.error('Error sending reset email:', err.message);
      if (err.code === 'auth/user-not-found') {
        message.error('No user found with this email.');
      } else {
        message.error('Error sending reset email. Please try again.');
      }
    }
  };

  const handleSignUp = async (values) => {
    const { email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      message.success("Signup Successfully");
      form.resetFields();
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err.message);
      if (err.code === 'auth/email-already-in-use') {
        message.error('Email already in use.');
      } else if (err.code === 'auth/weak-password') {
        message.error('Password should be at least 6 characters.');
      } else {
        message.error('Signup failed. Please try again.');
      }
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    form.resetFields();
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    form.resetFields();
  };

  return (
    <div className="signup-container">
      <Form
        form={form}
        className="signup-form"
        onFinish={isSignUp ? handleSignUp : (isForgotPassword ? handleForgotPassword : handleSubmit)}
      >
        <Title level={2}>{isSignUp ? 'Sign Up' : (isForgotPassword ? 'Reset Password' : 'Login')}</Title>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        {!isForgotPassword && (
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
        )}
        {isSignUp && (
          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your password!' }]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isSignUp ? 'Sign Up' : (isForgotPassword ? 'Send Reset Email' : 'Login')}
          </Button>
        </Form.Item>
        {!isForgotPassword && !isSignUp && (
          <Form.Item>
            <Button type="link" onClick={toggleForgotPassword}>
              Forgot Password?
            </Button>
          </Form.Item>
        )}
        <Form.Item>
          {isForgotPassword ? (
            <Button type="link" onClick={toggleForgotPassword}>
              Back to Login
            </Button>
          ) : (
            isSignUp ? (
              <Button type="link" onClick={toggleSignUp}>
                Back to Login
              </Button>
            ) : (
              <Text>
                Don't have an account?{' '}
                <Button type="link" onClick={toggleSignUp}>
                  Sign Up
                </Button>
              </Text>
            )
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default LogIn;
