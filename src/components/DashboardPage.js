import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, message, Typography, Modal, List, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, signOut } from '../firebase/auth';
import { LoadScript, GoogleMap, Autocomplete, Marker } from '@react-google-maps/api';
import '../styles/styles.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Dashboard = ({ auth }) => {
  const [user, setUser] = useState(null);
  const [searchMode, setSearchMode] = useState('place');
  const [place, setPlace] = useState('');
  const [hospitalDetails, setHospitalDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        currentUser ? setUser(currentUser) : navigate('/login');
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    })();
  }, [navigate]);

  const fetchHospitalDetails = async (url, payload) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        message.error('Failed to fetch hospital details');
        return;
      }

      const data = await response.json();
      setHospitalDetails(data.hospital_details);
      message.success(`Found ${data.hospital_details.length} hospitals`);
      setPlace('');
    } catch (error) {
      console.error('Error fetching hospital details:', error);
      message.error('Error fetching hospital details');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSubmit = () => {
    place ? fetchHospitalDetails(`${process.env.REACT_APP_API_URL}/api/place`, { place_name: place }) : message.error('Please enter a place name');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const onLoad = (autocompleteInstance) => setAutocomplete(autocompleteInstance);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLocation({ lat, lng });
        fetchHospitalDetails(`${process.env.REACT_APP_API_URL}/api/location`, { location: `${lat}, ${lng}` });
        setMapVisible(false);
      } else {
        message.error('Please select a place from the suggestions');
      }
    }
  };

  const toggleSearchMode = (mode) => {
    setSearchMode(mode);
    setMapVisible(mode === 'map');
  };

  if (!user) {
    return (
      <Layout className="fixed-layout">
        <Content className="fixed-layout-content">
          <div className="site-layout-content">
            <Title level={2}>Loading...</Title>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <Layout className="fixed-layout">
        <Header className="dashboard-header">
          <div className="logo-container">
            <img src={`${process.env.PUBLIC_URL}/images/h_icon.jpeg`} alt="icon" className="logo" />
          </div>
          <div className="user-info">
            <span className="user-email">{user?.displayName}</span>
            <Button className="logout-button" type="primary" onClick={handleSignOut}>Logout</Button>
          </div>
        </Header>
        <Content className="fixed-layout-content">
          <div className="site-layout-content">
            <Title level={2} className='title-style'>Welcome to the Hospital Finder Dashboard</Title>
            <div className="input-container">
              {searchMode === 'place' ? (
                <>
                  <Input
                    placeholder="Enter place name"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="search-input"
                  />
                  <div className="button-group">
                    <Button
                      type="primary"
                      onClick={handlePlaceSubmit}
                      className="action-button"
                      loading={loading}
                    >
                      Submit Place
                    </Button>
                    <Button
                      type="default"
                      onClick={() => toggleSearchMode('map')}
                      className="action-button"
                    >
                      Google Map
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  type="default"
                  onClick={() => toggleSearchMode('place')}
                  className="action-button"
                >
                  Enter Place Name
                </Button>
              )}
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
                        <p>
                          <strong>Address:</strong> {item.formatted_address}
                        </p>
                      )}
                      {item.formatted_phone_number && (
                        <p>
                          <strong>Phone Number:</strong>{' '}
                          {item.formatted_phone_number}
                        </p>
                      )}
                      {item.rating && (
                        <p>
                          <strong>Rating:</strong> {item.rating}
                        </p>
                      )}
                      {item.website && (
                        <p>
                          <strong>Website:</strong>{' '}
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.website}
                          </a>
                        </p>
                      )}
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Content>
        <Footer className="fixed-layout-footer">
          ©2024 Created by Vidya Piske
        </Footer>
        <Modal
          visible={mapVisible}
          onCancel={() => setMapVisible(false)}
          footer={null}
          width="80%"
        >
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={{ lat: 17.35260820693234, lng: 78.55547866852676 }}
            zoom={10}
          >
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <Input
                placeholder="Search for a place"
                style={{ marginBottom: '20px', width: '100%' }}
              />
            </Autocomplete>
            {selectedLocation && <Marker position={selectedLocation} />}
          </GoogleMap>
        </Modal>
      </Layout>
    </LoadScript>
  );
};

export default Dashboard;
