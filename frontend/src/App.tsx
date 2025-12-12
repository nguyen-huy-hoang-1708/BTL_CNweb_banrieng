import React, { useState, useEffect } from 'react'
import { Layout, Menu, Button, Dropdown } from 'antd'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { UserOutlined, LogoutOutlined, DashboardOutlined, InfoCircleOutlined, SettingOutlined } from '@ant-design/icons'
import Home from './pages/Home'
import Roadmaps from './pages/Roadmaps'
import ModuleDetail from './pages/ModuleDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Admin from './pages/Admin'
import CVs from './pages/CVs'
import Exercises from './pages/Exercises'
import Calendar from './pages/Calendar'
import Progress from './pages/Progress'
import Certificates from './pages/Certificates'
import Interviews from './pages/Interviews'
import NotificationBell from './components/NotificationBell'

const { Header, Content, Footer } = Layout

const App: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('user_id')
    setIsLoggedIn(!!token)
    
    // Check if user is admin
    if (token && userId) {
      import('./services/api').then(({ default: api }) => {
        api.get(`/api/auth/users/${userId}`)
          .then((res) => {
            const user = res.data?.data
            setIsAdmin(user?.role === 'admin')
          })
          .catch(() => setIsAdmin(false))
      })
    } else {
      setIsAdmin(false)
    }
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    setIsLoggedIn(false)
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'account',
      icon: <InfoCircleOutlined />,
      label: 'Thông tin tài khoản',
      onClick: () => navigate('/account')
    },
    ...(isAdmin ? [{
      key: 'admin',
      icon: <SettingOutlined />,
      label: 'Admin Panel',
      onClick: () => navigate('/admin')
    }] : []),
    {
      key: 'progress',
      icon: <DashboardOutlined />,
      label: 'My Progress',
      onClick: () => navigate('/progress')
    },
    {
      key: 'cvs',
      icon: <UserOutlined />,
      label: 'My CVs',
      onClick: () => navigate('/cvs')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 auto', minWidth: 0, marginRight: 16 }}>
          <div style={{ 
            fontSize: 18, 
            fontWeight: 700, 
            color: '#1890ff',
            marginRight: 16,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>⚡ SkillSync</div>
          <Menu 
            mode="horizontal" 
            selectedKeys={[location.pathname]}
            style={{ 
              border: 'none', 
              background: 'transparent', 
              flex: '1 1 auto', 
              minWidth: 0,
              fontSize: 14
            }}
            items={[
              { key: '/', label: <Link to="/">HOME</Link> },
              { key: '/roadmaps', label: <Link to="/roadmaps">COURSES</Link> },
              { key: '/exercises', label: <Link to="/exercises">EXERCISES</Link> },
              { key: '/certificates', label: <Link to="/certificates">CERTIFICATES</Link> },
              { key: '/interviews', label: <Link to="/interviews">INTERVIEWS</Link> },
              { key: '/calendar', label: <Link to="/calendar">CALENDAR</Link> },
            ]}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Always show NotificationBell for testing - TODO: Remove in production */}
          <NotificationBell />
          {isLoggedIn ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="primary" icon={<UserOutlined />}>
                Account
              </Button>
            </Dropdown>
          ) : (
            <Button 
              type="primary" 
              icon={<UserOutlined />} 
              onClick={() => navigate('/login')}
            >
              SIGN IN/SIGN UP
            </Button>
          )}
        </div>
      </Header>
      <Content style={{ padding: 0, minHeight: 'calc(100vh - 128px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/roadmaps/:roadmapId/modules/:moduleId" element={<ModuleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cvs" element={<CVs />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/interviews" element={<Interviews />} />
        </Routes>
      </Content>
      <Footer style={{ 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        padding: '48px 60px 32px',
        borderTop: '4px solid #1890ff'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            marginBottom: 16,
            background: 'linear-gradient(90deg, #fff, #64b5f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ⚡ SkillSync
          </div>
          <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 24 }}>
            Own Your Future By Learning Skills
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 40, 
            marginBottom: 24,
            flexWrap: 'wrap'
          }}>
            <a href="#" style={{ color: 'white', opacity: 0.8, fontSize: 14 }}>About Us</a>
            <a href="#" style={{ color: 'white', opacity: 0.8, fontSize: 14 }}>Careers</a>
            <a href="#" style={{ color: 'white', opacity: 0.8, fontSize: 14 }}>Contact</a>
            <a href="#" style={{ color: 'white', opacity: 0.8, fontSize: 14 }}>Privacy</a>
            <a href="#" style={{ color: 'white', opacity: 0.8, fontSize: 14 }}>Terms</a>
          </div>
          <div style={{ fontSize: 14, opacity: 0.6 }}>
            ©{new Date().getFullYear()} SkillSync. All Rights Reserved.
          </div>
        </div>
      </Footer>
    </Layout>
  )
}

export default App
