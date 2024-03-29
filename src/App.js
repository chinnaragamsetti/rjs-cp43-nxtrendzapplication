import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item

  //   TODO: Update the code here to implement addCartItem

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  addCartItem = product => {
    const {cartList} = this.state
    const productObject = cartList.find(
      eachCartItem => eachCartItem.id === product.id,
    )

    if (productObject !== undefined) {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachCartItem => {
          if (eachCartItem.id === productObject.id) {
            const updateQuantity = eachCartItem.quantity + product.quantity
            return {...eachCartItem, quantity: updateQuantity}
          }
          return eachCartItem
        }),
      }))
    } else {
      const updatedCartList = [...cartList, product]
      this.setState({cartList: updatedCartList})
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const afterRemovedCartList = cartList.filter(each => each.id !== id)
    this.setState({cartList: afterRemovedCartList})
  }

  incrementCartItemQuantity = id => {
    // const {cartList} = this.state
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachItem => {
        if (eachItem.id === id) {
          return {...eachItem, quantity: eachItem.quantity + 1}
        }
        return eachItem
      }),
    }))
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state

    const productObject = cartList.find(eachCartItem => eachCartItem.id === id)

    if (productObject.quantity > 1) {
      const newList = cartList.map(eachItem => {
        if (eachItem.id === id) {
          return {...eachItem, quantity: eachItem.quantity - 1}
        }
        return eachItem
      })
      this.setState({cartList: newList})
    } else {
      this.removeCartItem(id)
    }

    /*
    const newList = cartList.map(eachItem => {
      if (eachItem.id === id) {
        if (eachItem.quantity > 1) {
          return {...eachItem, quantity: eachItem.quantity - 1}
        }
        return this.removeCartItem(id)
      }
      return eachItem
    })
    this.setState({cartList: newList})
    /*
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachItem => {
        if (id === eachItem.id) {
          if (eachItem.quantity > 1) {
            return {...eachItem, quantity: eachItem.quantity - 1}
          }
        }
        return eachItem
      }),
    }))
    */
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
