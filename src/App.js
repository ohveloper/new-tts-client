import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setIsLogin, setUserInfo} from './actions/userAction'
import axios from 'axios'
import React,{useState, useEffect} from "react";
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyPage from './pages/MyPage'
import WelcomePage from './pages/WelcomePage'
import {useSelector} from 'react-redux'

 

function App() {
  const dispatch = useDispatch()
  const [accessToken,setAccessToken] = useState('') 


  const getAccessToken =(authorizationCode)=>{
    axios.post('https://localhost:5000/main/oauth/accesstoken', { authorizationCode: authorizationCode,accept:'application/json',withCredentials:true})
    .then(res=> {
      setAccessToken(res.data.data.accessToken)})
  }

  const getUserInfo = ()=>{
    axios.get('https://api.github.com/user',{headers:{authorization:`token ${accessToken}`, Accept: 'application/json'}})
    .then(res=>{
      const { login, id, name } = res.data;
      const param = {email: `${login}@github.com`, password: id, userName: name?name:login};
      axios.post('https://localhost:5000/main/signup', param, {accept: 'application/json'})
      .finally(e => {
        axios.post('https://localhost:5000/main/login', param, {accept: 'application/json',withCredentials:true})
        .then(res => {
          dispatch(setIsLogin());
          dispatch(setUserInfo());
        })
      })

    })
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const authorizationCode = url.searchParams.get('code')
    if (authorizationCode) {
      getAccessToken(authorizationCode)
    }
  }, []);

  useEffect(()=>{
    getUserInfo()
  },[accessToken])


  useEffect(()=>{
    
  },[useSelector(s=>s.recordReducer.isLogin)])


  return (
    <Router>
    <div>
      <Switch>
      <Route  exact path="/" component={LoginPage}/>
      <Route  path="/main" component={MainPage}/>
      <Route  path="/welcome" component={WelcomePage}/>
      <Route  path="/signup" component={SignupPage}/>
      <Route  path="/mypage" component={MyPage}/>
      </Switch>
    </div>
  </Router>
  );
}

export default App;
