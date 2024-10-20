import {Layout} from "./Components/Layout";
import {Route, Routes} from "react-router";
import {MainScreen} from "./Pages/MainScreen";
import {Inbox} from "./Pages/Inbox";
import {Login} from "./Pages/Login";

function App() {

  return (
    <Layout>
        <Routes>
            <Route path="/login" element={ <Login/> }/>
            <Route exec path="/" element={<MainScreen />} />
            <Route path="/inbox" element={ <Inbox/> }/>
        </Routes>
    </Layout>
  );
}

export default App;
