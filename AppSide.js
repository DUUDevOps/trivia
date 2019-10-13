import React, { Component } from 'react';
import './AppSide.css';
import firebase from '../../firebase';


class AppSide extends Component {
  constructor() {
    super();
    this.state = {
      //Holds the value of the current answer
      currentAns: "",         
      //An array of the all the answers in a round (This is packaged and sent to Firebase after submit)
      ansArray: []
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
}


// Handles user inputs, adds them to ansArray
onChange(e) {
  this.setState({
    [e.target.name]: e.target.value,
    //Need code here to append currentAns to the array.
  });
}





//Packages the ansArray and pushes it to Firebase
onSubmit(e) {
  e.preventDefault();
  const itemsRef = firebase.database().ref('items');
  const item = {
    answers: this.state.ansArray  //Send the array of answers to Firebase (Ordered by question order)
  }
  itemsRef.push(item);
  
  //Clear inputs to enable next input
  this.setState({
    currentAns: ""
  });
}


//HTML code goes here, copy pasted this, needs editing
render() {
  return (
    <div className='app'>
      <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
                           
          </div>
      </header>
      <div className='container'>
        <section className='add-item'>
              <form onSubmit={this.handleSubmit}>
                <input type="text" name="username" placeholder="What's your name?" onChange={this.handleChange} value={this.state.username} />
                <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.handleChange} value={this.state.currentItem} />
                <button>Add Item</button>
              </form>
        </section>
        <section className='display-item'>
            <div className="wrapper">
              <ul>
                {this.state.items.map((item) => {
                  return (
                    <li key={item.id}>
                      <h3>{item.title}</h3>
                      <p>brought by: {item.user}
                        <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
        </section>
      </div>
    </div>
  );
}
}

export default AppSide;