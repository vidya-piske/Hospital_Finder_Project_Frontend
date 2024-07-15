import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';
import '../styles/styles.css';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-image">
        <img src={`${process.env.PUBLIC_URL}/images/hospital_image.avif`} alt="Hospital Finder" className="full-width-image" />
        <div className="image-overlay">
          <div className="overlay-text">
            <Title level={1} className="overlay-title">Welcome to Hospital Finder</Title>
            <Paragraph className="overlay-paragraph">
              Discover nearby hospitals and healthcare facilities with ease.
            </Paragraph>
            <Link to="/login">
              <Button type="primary" size="large" className="custom-button">Login to Explore</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
