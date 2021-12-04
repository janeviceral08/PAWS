import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route} from "react-router-dom";
import sales from "./pages/sales";
import invoiceDetails from "./pages/invoiceDetails";
import addProduct from "./pages/addProduct";
import addService from "./pages/addService";
import customer from "./pages/customer";
import appointment from "./pages/appointment";
import addPet from "./pages/addPet";
import dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';


function App() {
  return (
    <Router>
   <Route path="/" exact component={Login} />
  <Route path="/sales" exact component={sales} />
  <Route path="/invoiceDetails/:invoiceInfo" exact component={invoiceDetails} />
  <Route path="/products" exact component={addProduct} />
  <Route path="/services" exact component={addService} />
  <Route path="/customer" exact component={customer} />
  <Route path="/appointment" exact component={appointment} />
  <Route path="/pet" exact component={addPet} />
  <Route path="/dashboard" exact component={dashboard} />
 
  
    </Router>
   
  );
}

export default App;
