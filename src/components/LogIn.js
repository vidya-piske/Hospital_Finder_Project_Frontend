import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { googleLogin, logIn, signUp, resetPassword } from '../firebase/auth'; // Adjust path as per your setup
import '../styles/styles.css';

const { Title, Text } = Typography;

const LogIn = () => {
  const [form] = Form.useForm();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogIn = async (values) => {
    const { email, password } = values;
    try {
      await logIn(email, password);
      message.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please try again.');
    }
  };

  const handleSignUp = async (values) => {
    const { email, password } = values;
    try {
      await signUp(email, password);
      message.success('Sign up successful! Please log in.');
      setIsSignUp(false);
      form.resetFields();
    } catch (error) {
      console.error('Sign up error:', error);
      message.error('Sign up failed. Please try again.');
    }
  };

  const handleForgotPassword = async (values) => {
    const { email } = values;
    try {
      await resetPassword(email);
      message.success('Password reset email sent. Check your inbox.');
    } catch (error) {
      console.error('Reset password error:', error);
      message.error('Error sending reset email. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      message.success('Google login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      message.error('Google login failed. Please try again.');
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
        onFinish={isSignUp ? handleSignUp : (isForgotPassword ? handleForgotPassword : handleLogIn)}
      >
        <Title level={2}>{isSignUp ? 'Sign Up' : (isForgotPassword ? 'Reset Password' : 'Login')}</Title>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please enter your email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        {!isForgotPassword && (
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
        )}
        {isSignUp && (
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
        )}
        <Form.Item>
          {!isForgotPassword && !isSignUp && (
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          )}
          {isSignUp && (
            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>
          )}
          {isForgotPassword && (
            <Button type="primary" htmlType="submit" block>
              Reset Password
            </Button>
          )}
        </Form.Item>
        {!isForgotPassword && !isSignUp && (
          <Form.Item>
            <Button type="primary" onClick={handleGoogleLogin} block>
              Login with Google
            </Button>
          </Form.Item>
        )}
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
