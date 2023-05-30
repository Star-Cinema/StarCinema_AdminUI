/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import SchedulesTable from "./pages/ScheduleTables";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import Booking from './pages/Booking';
import Service from "./pages/Service";
import Room from '../src/pages/Room'
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ChatPage from "./pages/ChatPage";
import ChatProvider from "./context/ChatContext";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import './assets/styles/public.css'
import Category from "./pages/Category";
import Film from "./pages/Film";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";

function App() {
  //Check login HungTD34
  console.log(sessionStorage.getItem("token"))
  if (sessionStorage.getItem("token")?.length > 10)
    return (
      <div className="App">
        <Switch>
          <Route path='/'>
            {/* <ChatProvider>
              <Route path='/chat' component={ChatPage} />
            </ChatProvider> */}
            <Main>
            <Route exact path="/service" component={Service} />
              <Route exact path="/booking" component={Booking} />
              <Route exact path="/" component={Home} />
              <Route exact path="/dashboard" component={Home} />

              <Route exact path="/schedules" component={SchedulesTable} />

              <Route exact path="/users" component={Users} />
              <Route exact path="/users/:id" component={UserDetails} />
              <Route exact path="/category" component={Category} />
              <Route exact path="/film" component={Film} />
              <Route exact path="/room" component={Room} />
              <Route exact path="/billing" component={Billing} />
              <Route exact path="/profile" component={Profile} />
              <ChatProvider>
              <Route path='/chat' component={ChatPage} />
            </ChatProvider>
            </Main>
          </Route>
        </Switch>

      </div>
    )
  else return (
    <SignIn />
  )
  
}

export default App;
