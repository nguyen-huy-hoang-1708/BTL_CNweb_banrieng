import React, { useState, useEffect } from 'react'
import { Layout, Menu, Button, Dropdown, Input } from 'antd'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { UserOutlined, LogoutOutlined, DashboardOutlined, InfoCircleOutlined, SettingOutlined, SearchOutlined, ShoppingCartOutlined, GlobalOutlined } from '@ant-design/icons'
import Home from './pages/Home'
import Courses from './pages/Courses'
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
import Business from './pages/Business'
import Teach from './pages/Teach'
import NotificationBell from './components/NotificationBell'
import SearchCourses from './components/SearchCourses'
import CartDropdown from './components/CartDropdown'

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
        background: '#fff', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 1000,
        height: 64,
        borderBottom: '1px solid #e8e8e8'
      }}>
        {/* Logo */}
        <Link to="/" style={{ 
          fontSize: 28, 
          fontWeight: 800, 
          color: '#a435f0',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif",
          letterSpacing: '-0.5px'
        }}>
          ⚡ SkillSync
        </Link>
        
        {/* Explore Dropdown - Udemy style */}
        <Dropdown
          menu={{
            items: [
              { key: 'courses', label: <Link to="/courses">Courses</Link> },
              { key: 'exercises', label: <Link to="/exercises">Exercises</Link> },
              { key: 'certificates', label: <Link to="/certificates">Certificates</Link> },
            ]
          }}
          placement="bottomLeft"
        >
          <Button 
            type="text" 
            style={{ 
              fontSize: 16,
              fontWeight: 700,
              color: '#1c1d1f',
              height: 42,
              fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif"
            }}
          >
            Explore
          </Button>
        </Dropdown>

        {/* Search Bar - Udemy style */}
        <SearchCourses />

        {/* Right Side Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
          {/* Business Link */}
          <Button 
            type="text"
            onClick={() => navigate('/business')}
            style={{ 
              fontSize: 15,
              color: '#1c1d1f',
              fontWeight: 600,
              fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif"
            }}
          >
            SkillSync Business
          </Button>

          {/* Teach Link */}
          <Button 
            type="text"
            onClick={() => navigate('/teach')}
            style={{ 
              fontSize: 15,
              color: '#1c1d1f',
              fontWeight: 600,
              fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif"
            }}
          >
            Teach on SkillSync
          </Button>

          {/* Shopping Cart Dropdown */}
          <CartDropdown />

          {/* Notification Bell */}
          <NotificationBell />

          {/* User Account */}
          {isLoggedIn ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button 
                icon={<UserOutlined />}
                style={{ 
                  borderRadius: 50,
                  height: 42,
                  paddingLeft: 18,
                  paddingRight: 18,
                  fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif",
                  fontWeight: 600,
                  fontSize: 15
                }}
              >
                Account
              </Button>
            </Dropdown>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button 
                onClick={() => navigate('/login')}
                style={{ 
                  height: 42,
                  borderRadius: 6,
                  border: '1px solid #1c1d1f',
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif"
                }}
              >
                Log in
              </Button>
              <Button 
                type="primary"
                onClick={() => navigate('/register')}
                style={{ 
                  height: 42,
                  borderRadius: 6,
                  background: '#1c1d1f',
                  borderColor: '#1c1d1f',
                  fontWeight: 700,
                  fontSize: 15,
                  fontFamily: "'Poppins', 'Segoe UI', 'Roboto', sans-serif"
                }}
              >
                Sign up
              </Button>
            </div>
          )}

          {/* Language Globe */}
          <Button 
            type="text" 
            icon={<GlobalOutlined style={{ fontSize: 20 }} />}
            style={{ padding: '4px 8px' }}
          />
        </div>
      </Header>
      <Content style={{ padding: 0, minHeight: 'calc(100vh - 128px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
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
          <Route path="/business" element={<Business />} />
          <Route path="/teach" element={<Teach />} />
        </Routes>
      </Content>
      <Footer style={{ 
        background: '#1c1d1f',
        color: '#fff',
        padding: '40px 24px 24px',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: 1340, margin: '0 auto' }}>
          {/* Top Section with Columns */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            marginBottom: 40,
            paddingBottom: 32,
            borderBottom: '1px solid #3e4143'
          }}>
            {/* Column 1 */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#fff', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Explore top skills and certifications</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Web Development</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Data Science</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Machine Learning</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Mobile Development</a>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#fff', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>IT Certifications</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>AWS Certified</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Azure Fundamentals</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Kubernetes</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Docker</a>
              </div>
            </div>

            {/* Column 3 */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#fff', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>SkillSync for Business</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>SkillSync Business</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Teach on SkillSync</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Get the app</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>About us</a>
              </div>
            </div>

            {/* Column 4 */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#fff', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Legal & Accessibility</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Privacy policy</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Terms</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Sitemap</a>
                <a href="#" style={{ color: '#fff', fontSize: 13, opacity: 0.8, textDecoration: 'none', fontFamily: "'Segoe UI', 'Roboto', sans-serif" }}>Accessibility</a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ 
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              fontFamily: "'Segoe UI', 'Roboto', sans-serif"
            }}>
              ⚡ SkillSync
            </div>
            <div style={{ 
              fontSize: 12,
              color: '#fff',
              opacity: 0.7,
              fontFamily: "'Segoe UI', 'Roboto', sans-serif"
            }}>
              © {new Date().getFullYear()} SkillSync, Inc.
            </div>
            <Button
              icon={<GlobalOutlined />}
              style={{
                background: 'transparent',
                border: '1px solid #fff',
                color: '#fff',
                borderRadius: 4,
                height: 40,
                fontFamily: "'Segoe UI', 'Roboto', sans-serif"
              }}
            >
              English
            </Button>
          </div>
        </div>
      </Footer>
    </Layout>
  )
}

export default App
