import logo from './logo.svg';
import './App.css';
import CEdit from './components/currencyEdit.tsx';

function App() {
  return (
    <div className="App">
      <CEdit
        minFractDigits={2}
        maxDecLength={6}
      />
      <CEdit
        minFractDigits={2}
        maxDecLength={6}
      />
    </div>
  );
}

export default App;
