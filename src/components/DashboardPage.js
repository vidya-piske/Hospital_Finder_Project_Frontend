import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getCurrentUser, signOut } from '../firebase/auth';
import '../styles/styles.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Dashboard = ({ auth }) => {
  const [user, setUser] = useState(null);
  const [place, setPlace] = useState('');
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handlePlaceSubmit = () => {
    // Call your place API here with the place name
    message.success(`Place submitted: ${place}`);
  };

  const handleMapClick = (event) => {
    setLatLng({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    // Call your latitude and longitude API here with latLng
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Layout className="fixed-layout">
      <Header className="dashboard-header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-email">{user && user.email}</span>
          <Button className="logout-button" type="primary" onClick={handleSignOut}>
            Logout
          </Button>
        </div>
      </Header>
      <Content className="fixed-layout-content">
        <div className="site-layout-content">
          <Title level={2}>Dashboard</Title>
          <Input
            placeholder="Enter place name"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            style={{ width: 200, marginRight: 10 }}
          />
          <Button type="primary" onClick={handlePlaceSubmit}>
            Submit
          </Button>
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ height: '400px', width: '100%' }}
              center={latLng}
              zoom={10}
              onClick={handleMapClick}
            >
              <Marker position={latLng} />
            </GoogleMap>
          </LoadScript>
        </div>
      </Content>
      <Footer className="fixed-layout-footer">©2024 Created by Vidya Piske</Footer>
    </Layout>
  );
};

export default Dashboard;
