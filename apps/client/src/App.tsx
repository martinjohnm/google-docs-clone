
import { RecoilRoot, useRecoilValue } from 'recoil'
import './App.css'
import { SignupPage } from './pages/SignupPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { UserProtection } from './protected/UserProtection'
import { useFetchInitialData } from './hooks/user/useFetchInitialData'
import { userAtom } from './store/auth/auth.state'
import { LoginSignupWrap } from './protected/LoginSignupWrap'
import { DocumentPage } from './pages/DocumentPage'

function App() {

  return (
   
    <RecoilRoot >
        <AuthApp/>
    </RecoilRoot>
  )
}


function AuthApp () {

  useFetchInitialData()
  const user = useRecoilValue(userAtom)

  if (user.loading) {
    return <div>
      Loading...
    </div>
  }

  return (

        <BrowserRouter >
          <Routes>
              <Route path='/' element={<UserProtection><HomePage/></UserProtection>}/>
              <Route path='document/:id' element={<UserProtection><DocumentPage/></UserProtection>}/>
              <Route path="/signup" element={<LoginSignupWrap><SignupPage/></LoginSignupWrap>}/>
              <Route path='/login' element={<LoginSignupWrap><LoginPage/></LoginSignupWrap>}/>
          </Routes>
        </BrowserRouter>
      
  )
}

export default App
