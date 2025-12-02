import { BrowserRouter, Route, Routes } from "react-router-dom"
import { LandingPage } from "./pages/LandingPage"
import { RecoilRoot } from "recoil"

function App() {

  return (
    <>
    <RecoilRoot>
      <AuthApp/>
    </RecoilRoot>
    </>
  )
}


function AuthApp () {

  return (

    
 
      <div className="">
        <BrowserRouter >
          <Routes>
            
              <Route path="/" element={<LandingPage/>}/>
              
          </Routes>
        </BrowserRouter>
      
      </div>
  )
}

export default App
