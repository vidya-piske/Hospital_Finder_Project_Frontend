import React, { useEffect, useState } from 'react';
import { Layout, Input, Button, message, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../firebase/auth';
import MapModal from './MapModal';
import '../styles/styles.css';
import { setHospitalDetails } from '../redux/actions/userActions';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Dashboard = ({ auth }) => {
  const [user, setUser] = useState(null);
  const [place, setPlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(''); // State for active button

  const userValue = useSelector(state => state.user.user); // Access user from Redux state
  const hospitalDetails = useSelector(state => state.user.hospitalDetails); // Access hospitalDetails from Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (userValue) {
        setUser(userValue);
      } else {
        navigate('/login'); // Redirect if user is not in Redux state
      }
    } catch {
      message.error('Error fetching current user');
    }
  }, [userValue, navigate]); // Dependency array to rerun effect if userValue or navigate changes

  const fetchHospitalDetails = async (url, payload) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to fetch hospital details');

      const { summary } = await response.json();
      dispatch(setHospitalDetails(summary || 'No details available'));
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSubmit = () => {
    if (place) {
      setPlaceLoading(true);
      setActiveButton('submit'); // Set active button state
      fetchHospitalDetails(`${process.env.REACT_APP_API_URL}/place`, { place_name: place })
        .finally(() => {
          setPlaceLoading(false);
          setPlace(''); // Clear the input field
        });
    } else {
      message.error('Please enter a place name');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      message.error(`Error signing out: ${error.message}`);
    }
  };

  const handleMarkerSelect = async (coords) => {
    setMapLoading(true);
    setActiveButton('map'); // Set active button state
    await fetchHospitalDetails(`${process.env.REACT_APP_API_URL}/location`, { location: `${coords.lat},${coords.lng}` });
    setMapLoading(false);
  };

  return (
    <Layout className="fixed-layout">
      <Header className="dashboard-header">
        <div className="logo-container">
          <img src={`${process.env.PUBLIC_URL}/images/h_icon.jpeg`} alt="icon" className="logo" />
        </div>
        <div className="user-info">
          {user ? (
            <>
              <span className="user-email">{user.displayName || 'User'}</span>
              <Button className="logout-button" type="primary" onClick={handleSignOut}>Logout</Button>
            </>
          ) : (
            <span className="user-email">User</span>
          )}
        </div>
      </Header>
      <Content className="fixed-layout-content">
        <div className="site-layout-content">
          {!user ? (
            <Title level={2}>Loading...</Title>
          ) : (
            <>
              <Title level={2} className="title-style">Welcome to the Hospital Finder Dashboard</Title>
              <div className="input-container">
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
                    className={`action-button ${activeButton === 'submit' ? 'active' : ''}`} // Active button style
                    loading={placeLoading}
                  >
                    Submit Place
                  </Button>
                  <Button
                    type="default"
                    onClick={() => {
                      setMapModalVisible(true);
                      setActiveButton('map'); // Set active button state
                    }}
                    className={`action-button ${activeButton === 'map' ? 'active' : ''}`} // Active button style
                    loading={mapLoading}
                  >
                    Google Map
                  </Button>
                </div>
              </div>
              <div className="scrollable-content">
                {loading ? (
                  <div className="spinner-container">
                    <Spin size="medium" />
                  </div>
                ) : hospitalDetails && typeof hospitalDetails === 'string' ? (
                  <div className="response-cards-container">
                    <div className="response-card visible">
                      {hospitalDetails.split('\n\n').map((item, index) => (
                        <div key={index} className="hospital-detail">
                          {item.split('\n').map((line, idx) => (
                            <p key={idx} className="hospital-detail-line">{line}</p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </Content>
      <Footer className="fixed-layout-footer">
        ©2024 Created by Vidya Piske
      </Footer>
      <MapModal
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        onMarkerSelect={handleMarkerSelect}
      />
    </Layout>
  );
};

export default Dashboard;
