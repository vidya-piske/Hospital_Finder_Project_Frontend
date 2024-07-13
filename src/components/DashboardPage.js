import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, message, Typography, Modal, List, Card } from 'antd';
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
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [hospitalDetails, setHospitalDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchHospitalDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place_name: place }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch hospital details:', errorData);
        message.error('Failed to fetch hospital details');
        return;
      }

      const data = await response.json();
      setHospitalDetails(data.hospital_details);
      message.success(`Found ${data.hospital_details.length} hospitals`);
    } catch (error) {
      console.error('Error fetching hospital details:', error);
      message.error('Error fetching hospital details');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSubmit = () => {
    fetchHospitalDetails();
  };

  const handleMapClick = (event) => {
    setLatLng({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const showMap = () => {
    setIsMapVisible(true);
  };

  const hideMap = () => {
    setIsMapVisible(false);
  };

  return (
    <Layout className="fixed-layout">
      <Header className="dashboard-header">
        <div className="logo">Hospital Finder</div>
        <div className="user-info">
          <span className="user-email">{user && user.email}</span>
          <Button className="logout-button" type="primary" onClick={handleSignOut}>
            Logout
          </Button>
        </div>
      </Header>
      <Content className="fixed-layout-content">
        <div className="site-layout-content">
          <Title level={2}>Welcome to the Hospital Finder Dashboard</Title>
          <Input
            placeholder="Enter place name"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="input-field"
          />
          <div className="button-group">
            <Button type="primary" onClick={handlePlaceSubmit} className="action-button" loading={loading}>
              Submit
            </Button>
            <Button type="default" onClick={showMap} className="action-button">
              Google Map
            </Button>
          </div>
        </div>
        <div className="scrollable-content">
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={hospitalDetails}
          loading={loading}
          renderItem={(item) => (
            <List.Item>
              <Card title={item.name}>
                {item.formatted_address && (
                  <p><strong>Address:</strong> {item.formatted_address}</p>
                )}
                {item.formatted_phone_number && (
                  <p><strong>Phone Number:</strong> {item.formatted_phone_number}</p>
                )}
                {item.rating && (
                  <p><strong>Rating:</strong> {item.rating}</p>
                )}
                {item.website && (
                  <p><strong>Website:</strong> <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a></p>
                )}
              </Card>
            </List.Item>
          )}
        />
        </div>
        <Modal
          title="Google Map"
          visible={isMapVisible}
          onCancel={hideMap}
          footer={null}
          width="80%"
          centered
        >
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
        </Modal>
      </Content>
      <Footer className="fixed-layout-footer">©2024 Created by Vidya Piske</Footer>
    </Layout>
  );
};

export default Dashboard;