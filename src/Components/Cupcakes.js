import React, {Component} from 'react';
import '../App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import subDays from "date-fns/subDays";
import { NavLink } from 'react-router-dom';

// //Generate buttons
function Buttons({ list, handleClick }) {
  const style={
    display: 'inline-block',
    textAlign: 'center',
    border: '1px solid black',
    padding: '10px',
    margin: '10px',
    color: 'purple',
    backgroundColor: 'aliceblue',
    width: '40%',

  }
  return (
    <div>
        {list && list.map(item =>
            <button key={item.key}
            style={style}
            onClick={() => handleClick(item.key)}
            className={item.isSelected ? "active" : ""}
            >
                {/* <p>{item.key}</p> */}
                <p className="fontStyle">{item.name}</p>
                <p className="fontStyle">${item.price}.00</p>
                {/* <p>{item.ingredients}</p> */}
            </button>
        )}
    </div>
  );
};

class Cupcakes extends Component {
    constructor() {
      super();

      this.state = {
          bases: [],
          frostings: [],
          toppings: [],
          isToggleOn: true,
          cupcakes: [], 
          startDate: new Date(),  
          price: '',
      }
  };

  componentDidMount() {
    this.getBases();
    this.getFrostings();
    this.getToppings(); 
    this.postOrder(); 
  }

  /* GET DATA FROM SERVER */
  getBases() {
    fetch('http://localhost:4000/cupcakes/bases')
    .then(results => results.json())
    .then(results => {
        const finalResults = results.bases.map(resObj => {
            resObj["isSelected"] = false; 
            return resObj;
          })
          return finalResults; 
        })
    .then(finalResults => this.setState({'bases': finalResults})
  )} 

  getFrostings() {
    fetch('http://localhost:4000/cupcakes/frostings')
    .then(results => results.json())
    .then(results => {
      const finalResults = results.frostings.map(resObj => {
          resObj["isSelected"] = false; 
          return resObj;
        })
        return finalResults; 
      })
    .then(results => this.setState({'frostings': results}))
  }

  getToppings() {
    fetch('http://localhost:4000/cupcakes/toppings')
    .then(results => results.json())
    .then(results => {
      const finalResults = results.toppings.map(resObj => {
          resObj["isSelected"] = false; 
          return resObj;
        })
        return finalResults; 
      })
    .then(results => this.setState({'toppings': results}))
  }

  handleSingleSelected = type => key => {
    this.setState(state => ({
      [type]: state[type].map(item => ({
        ...item,
        isSelected: item.key === key,
      }))
    }));
  };

  handleMultiSelected = type => key => {
    this.setState(state => ({
      [type]: state[type].map(item => {
        if (item.key === key) {
          return {
            ...item,
            isSelected: !item.isSelected,
          };
        }
        return item;
      })
    }));
  };

  printPrice() {
    let { bases, frostings, toppings } = this.state;
    const selectedBase = bases.filter(({ isSelected }) => isSelected);
    const selectedFrosting = frostings.filter(({ isSelected }) => isSelected);
    const selectedToppings = toppings.filter(({ isSelected }) => isSelected); 

    let basePrice = 0;
    let frostingPrice = 0;
    let toppingsPrice = 0; 
    let deliveryCost = 1.50; 
    let salesTax = .0875; 

    selectedBase.map(item => {
      basePrice = item.price; 
      return (
        basePrice
      );
    })
    selectedFrosting.map(item => {
      frostingPrice = item.price; 
      return (
        frostingPrice
      );
    })
    selectedToppings.map(item => {
      toppingsPrice = item.price; 
      return (
        toppingsPrice
      );
    })

    return (
      <ul>
      <li>Cupcake Price: ${basePrice+frostingPrice+toppingsPrice}.00</li>
      <li>Sales Tax (IL): ${(salesTax*(basePrice+frostingPrice+toppingsPrice)).toFixed(2)}</li>
      <li>Delivery Charge: ${deliveryCost.toFixed(2)}</li>
      <li>Subtotal: ${(deliveryCost+basePrice+frostingPrice+toppingsPrice).toFixed(2)}</li>
      <li>Total: ${(
        (salesTax*(basePrice+frostingPrice+toppingsPrice))+
        (deliveryCost+basePrice+frostingPrice+toppingsPrice)
      ).toFixed(2)}</li>
      </ul>
    )
  }

  handleAddToCart = () => {
    let { bases, frostings, toppings, cupcakes } = this.state;
    const selectedBase = bases.filter(({ isSelected }) => isSelected);
    const selectedFrosting = frostings.filter(({ isSelected }) => isSelected);
    const selectedToppings = toppings.filter(({ isSelected }) => isSelected); 
  
    console.log(selectedToppings);

    const cupcakeDec = {
      base: selectedBase[0].key,
      toppings: selectedToppings.map(topping => topping.key),
      frosting: selectedFrosting[0].key
    }

    console.log('CupcakeDec: ', cupcakeDec); 
    const updatedCupcakes = [...cupcakes, cupcakeDec]
    this.setState({cupcakes: updatedCupcakes})
  }

  printCart = () => {
    let { bases, frostings, toppings } = this.state;

    const selectedBase = bases.filter(({ isSelected }) => isSelected);
    const selectedFrosting = frostings.filter(({ isSelected }) => isSelected);
    const selectedToppings = toppings.filter(({ isSelected }) => isSelected);
    
    let base = "";
    let frosting = "";
    let topping = "";

    selectedBase.map(item => {
      base = item.name; 
      return (
        base
      );
    })
    selectedFrosting.map(item => {
      frosting = item.name; 
      return (
        frosting
      )
    })
    selectedToppings.map(item => {
      topping = item.name; 
      return (
        topping
      )
    })
 
    return (
    <div>
      {/* {cupcakes && cupcakes.map((item, index) =>  */}
      <div>
        <ul>
        <li>{base}</li>
        <li>{frosting}</li>
        <li>{topping}</li>
        </ul>
        </div>
      {/* )} */}
    </div>
    );
  }

  handleDateChange = date => {
    this.setState({
      startDate: date
    });
  };

  // placeOrder = () => {
  //     let {cupcakes, startDate} = this.state;

  //     const goodOrder = {
  //       order: {
  //         cupcakes: cupcakes,
  //         delivery_date: startDate.toISOString()
  //       }
  //     }  
  //     console.log(goodOrder);
  //     this.postOrder(goodOrder);    
  // }

  postOrder = () => {
    let {cupcakes, startDate} = this.state;
    console.log(cupcakes); 

    const goodOrder = {
      order: {
        cupcakes: cupcakes,
        delivery_date: startDate.toISOString()
      }
    }  
    console.log(goodOrder);

    fetch('http://localhost:4000/cupcakes/orders', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(goodOrder),
    }).then(response => response.json())
    .then(response => {
      console.log(response)
    })
  }

  render() { 

    const {bases, frostings, toppings, startDate } = this.state; 
    const today = new Date(); 
    const tommorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    //for testing purposes
    // console.log(bases); 
    // console.log(frostings); 
    // console.log(toppings);
  
    return (   
      <div>
      <div className="objects col-md-7">
        <h1 style={{fontSize:'30px'}}>Choose a base</h1>
        <Buttons on 
         list={bases}
         handleClick={this.handleSingleSelected("bases")}
        />
        <h1 style={{fontSize:'30px'}}>Choose a frosting</h1>
        <Buttons
         list={frostings}
         handleClick={this.handleSingleSelected("frostings")}
        />
        <h1 style={{fontSize:'30px'}}>Choose toppings</h1>
        <Buttons
         list={toppings}
         handleClick={this.handleMultiSelected("toppings")}
         />
      </div>
      <div className="summary">
        <h1 style={{fontSize:'30px'}}>Price</h1>
        {this.printPrice()}
        <h1 style={{fontSize:'30px'}}>Your cupcake</h1>
        {this.printCart()}
        <button onClick={this.handleAddToCart}>Add to Cart</button>
        <h1 style={{fontSize:'30px'}}>Choose a delivery date</h1>
        <DatePicker
        selected={startDate}
        onChange={this.handleDateChange}
        minDate={tommorrow}
        excludeDates={[new Date(), subDays(new Date(), 1)]}
        />
        <button onClick={this.postOrder} >Place Order</button>
        <NavLink to="/orders">See Orders</NavLink>

      </div>
      </div>
   
    );
  }
}

export default Cupcakes;

// HIGH PRIORITY
// Sort table by delivery date on load
//  Destructured object let {orders} = ordersObject
// Filter table by components

// MEDIUM PRIORITY
// Different toppings being added into the array 

// LOW PRIORITY 

// Design

