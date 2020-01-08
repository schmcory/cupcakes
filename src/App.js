import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
 
import Cupcakes from './Components/Cupcakes';
import Orders from './Components/Orders';

class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
             <Route path="/" component={Cupcakes} exact/>
             <Route path="/orders" component={Orders}/>
            {/* <Route component={Error}/> */}
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;