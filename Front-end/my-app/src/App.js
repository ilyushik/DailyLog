import {Layout} from "./Components/Layout";
import {Navigate, Route, Routes} from "react-router";
import {MainScreen} from "./Pages/MainScreen";
import {Inbox} from "./Pages/Inbox";
import {Login} from "./Pages/Login";
import {PeopleList} from "./Pages/PeopleList";

const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
}

const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {

  return (
    <Layout>
        <Routes>
            <Route exact path="/" element={<PrivateRoute><MainScreen /></PrivateRoute>} />
            <Route path="/login" element={ <Login/> }/>
            <Route exec path="/my-info" element={<PrivateRoute><MainScreen /></PrivateRoute>} />
            <Route path="/inbox" element={ <PrivateRoute><Inbox/></PrivateRoute> } />
            <Route path="/people" element={<PrivateRoute><PeopleList/></PrivateRoute>}/>
            <Route path="/user/:id" element={<PrivateRoute><MainScreen /></PrivateRoute>}/>
        </Routes>
    </Layout>
  );
}

export default App;
