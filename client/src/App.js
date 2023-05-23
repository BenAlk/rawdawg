import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Auth } from './pages/Auth'
import { Home } from './pages/Home'
import { AddDog } from './pages/AddDog'
import { Config } from './pages/Config'
import { EditDog } from './pages/EditDog'
import { AddFood } from './pages/Food'
import { EditFood } from './pages/EditFood'
import { Calendar } from './pages/Calendar'
import { AddCalendar } from './pages/AddCalendar'
import { EditCalendar } from './pages/EditCalendar'
import { OrderSheet } from './pages/OrderSheet'
import { Layout } from './components/Layout'
import { ConfigNav } from './components/ConfigNav'
import { CalendarNav } from './components/CalendarNav'



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/Auth" element={<Auth />} />
            <Route path="/Config" element={<ConfigNav />}>
              <Route index element={<Config />}/>
              <Route path="AddDog" element={<AddDog />} />
              <Route path="Edit/:id" element={<EditDog />} />
              <Route path="Food" element={<AddFood />} />
              <Route path="Food/:id" element={<EditFood />} />
            </Route>
            <Route path="/Calendar" element={<CalendarNav />}>
              <Route index element={<Calendar />} />
              <Route path="AddCalendar" element={<AddCalendar />} />
              <Route path="Edit/:id" element={<EditCalendar />} />
              <Route path="OrderSheet/:id" element={<OrderSheet />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
