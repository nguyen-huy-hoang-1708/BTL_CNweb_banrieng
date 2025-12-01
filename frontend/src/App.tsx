import React from 'react'
import { Layout, Menu, Button } from 'antd'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { UserOutlined } from '@ant-design/icons'
import Home from './pages/Home'
import Roadmaps from './pages/Roadmaps'
import Login from './pages/Login'
import Register from './pages/Register'
import CVs from './pages/CVs'
import Exercises from './pages/Exercises'
import Calendar from './pages/Calendar'
import Progress from './pages/Progress'
import Certificates from './pages/Certificates'
import Interviews from './pages/Interviews'

const { Header, Content, Footer } = Layout

const App: React.FC = () => {
  const location = useLocation()

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: '#1890ff',
            marginRight: 50
          }}>⚡ SkillSync</div>
          <Menu 
            mode="horizontal" 
            selectedKeys={[location.pathname]}
            style={{ border: 'none', background: 'transparent', flex: 1 }}
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
        <Button type="primary" icon={<UserOutlined />} onClick={() => window.location.href = '/login'}>
          SIGN IN/SIGN UP
        </Button>
      </Header>
      <Content style={{ padding: 0, minHeight: 'calc(100vh - 128px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
        background: '#001529',
        color: 'white',
        padding: '24px 50px'
      }}>
        <div>SkillSync - Own Your Future By Learning Skills</div>
        <div style={{ marginTop: 8, opacity: 0.7 }}>©{new Date().getFullYear()} All Rights Reserved</div>
      </Footer>
    </Layout>
  )
}

export default App
