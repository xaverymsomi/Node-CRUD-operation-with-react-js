import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import Student from './Student';
import CreateStudent from './CreateStudent';
import EditStudent from './EditStudent';
import DeleteStudent from './DeleteStudent';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Student />}></Route>
          <Route path='/create' element={<CreateStudent />}></Route>
          <Route path='/edit/:id' element={<EditStudent />}></Route>
          <Route path='/delete/:id' element={<DeleteStudent />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
