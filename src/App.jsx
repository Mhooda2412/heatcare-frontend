import { useState } from 'react'
// import './App.css'

import Header from './components/Header'
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BarChartPage from './components/BarChartPage';
import LineChartPage from './components/LineChartPage';
import FileUpload from './components/FileUpload';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Header>
        <Routes>
          {
            <>
            <Route path='/' element={<Home />}></Route>
            <Route path='/bar-chart' element={<BarChartPage></BarChartPage>}></Route>
            <Route path='/line-chart' element={<LineChartPage></LineChartPage>}></Route>
            <Route path='/file-upload' element={<FileUpload></FileUpload>}></Route>
            </>
          }
          {/* <Route path="/file-upload" element={<FileUpload />} />
          <Route path="/dashboard" element={<BarChart/>}></Route>
          <Route path="/reports" element={<WorldMap/>}></Route> */}
        </Routes>
      </Header>
    </Router>
  )
}

export default App
