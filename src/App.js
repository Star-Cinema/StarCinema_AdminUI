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
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import './assets/styles/public.css'

function App() {
  // console.log(sessionStorage.getItem("token"))
  if(sessionStorage.getItem("token")?.length > 10)
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-up" exact component={SignUp} />
        {/* <Route path="/sign-in" exact component={SignIn} /> */}
        <Main>
          <Route exact path="/booking" component={Booking} />
          <Route exact path="/" component={Home} />
          <Route exact path="/dashboard" component={Home} />

          <Route exact path="/schedules" component={SchedulesTable} />

          <Route exact path="/users" component={Users} />
          <Route exact path="/users/:id" component={UserDetails} />

          <Route exact path="/billing" component={Billing} />
          <Route exact path="/profile" component={Profile} />
        </Main>
      </Switch>
    </div>
  )
  else return(
    <SignIn/>
  )
}

export default App;
