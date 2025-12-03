
import { RecoilRoot } from 'recoil'
import './App.css'
import { SignupPage } from './pages/SignupPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
   
    <RecoilRoot >
        <AuthApp/>
    </RecoilRoot>
  )
}


function AuthApp () {

  return (

    
      //@ts-ignore
      <div className="">
        <BrowserRouter >
          <Routes>
              <Route path="/" element={<SignupPage/>}/>
          </Routes>
        </BrowserRouter>
      
      </div>
  )
}

export default App
