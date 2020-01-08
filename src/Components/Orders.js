//https://stackoverflow.com/questions/44375407/how-to-make-a-table-in-reactjs-sortable/44375705
//https://dev.to/abdulbasit313/an-easy-way-to-create-a-customize-dynamic-table-in-react-js-3igg

import React, {Component} from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

class Orders extends Component {
    constructor(props) {
      super(props);
      this.state = {
        // order: [ 
        //   {id: '000', 
        //   delivery_date: '03/15/1989', 
        //   cupcakes: ['peanutButterBase', 'vanillaFrosting', ['sprinkles', 'coconutFlakes']]},
        //   {id: '001', 
        //   delivery_date: '03/15/1990', 
        //   cupcakes: ['peanutButterBase', 'vanillaFrosting', ['sprinkles', 'coconutFlakes']]}
        // ], 
        ordersObject: {},
        sortingOrder: 'ASC',
      };
      
      this.sortBy.bind(this);
    }

    componentDidMount() {
      this.getOrders(); 
      // this.sortBy('delivery_date', 'DESC');
    }

    renderTableData(orders) { 
      const date = "2020";  
      return (
          <tbody>
            {orders && orders.map(item =>
            date <= item.delivery_date && item.cupcakes != "" &&
                    <tr key={item.id}>  
                      <td>{new Date(item.delivery_date).toLocaleDateString()}</td>
                      <td>
                        {item.cupcakes.map((subitem =>
                            <ul>
                            <li>{subitem.base}</li>
                            <li>{subitem.frosting}</li>
                            {subitem.toppings.map((subsubitem =>
                                <li>{subsubitem}</li>
                            ))}
                            </ul>
                          ))}
                      </td>
                    </tr>
            )}
          </tbody>
      );
    }

    /* GET DATA FROM SERVER */
    getOrders() {
      fetch('http://localhost:4000/cupcakes/orders')
      .then(results => results.json())
      .then(results => this.setState({'ordersObject': results}))
    }

    //sort by DESC/ASC
    sortBy(sortedKey, sortedAs) {   
        let data = this.state.ordersObject.orders;
        console.log(data);   
        let sortingOrder = this.state.sortingOrder; ;
        if(sortingOrder === sortedAs) {
            sortingOrder = 'DESC'; 
            data.sort((a,b) => b[sortedKey].localeCompare(a[sortedKey]))
        }
        else {
            sortingOrder = 'ASC'; 
            data.sort((a,b) => a[sortedKey].localeCompare(b[sortedKey]))
        }
        this.setState({ data, sortingOrder }) 
    }
      
    render() { 

      let {ordersObject} = this.state;
      let {orders} = ordersObject; 
      
      //console.log(ordersObject.orders); 

      return ( 
        <table className="zui-table"> 
        <thead>
        <tr>
        <th>ORDERS</th>
        <th></th>
        </tr>
          <tr>
            <th onClick={() => this.sortBy('delivery_date', 'ASC')}>Date</th>
            <th>Description <input type="text"/></th>
          </tr>
        </thead>
            {this.renderTableData(orders)}
        </table>
      );
      
    }
  }

  export default Orders; 