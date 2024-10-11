import {modeActions} from "./store/index";
import {useSelector, useDispatch} from "react-redux";

function App() {
  const mode = useSelector(state => state.mode);
  const dispatch = useDispatch();

  const lightMode = () => {
      dispatch(modeActions.lightMode())
  }

  const darkMode = () => {
      dispatch(modeActions.darkMode())
  }

  return (
    <div className="App">
        <h3>{mode}</h3>
        <button onClick={lightMode}>Light</button>
        <button onClick={darkMode}>Dark</button>
    </div>
  );
}

export default App;
