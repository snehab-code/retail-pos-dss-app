import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {startUserLogout, setActiveBusiness} from '../../actions/user'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import StorefrontIcon from '@material-ui/icons/Storefront'
import ShowChartIcon from '@material-ui/icons/ShowChart'
import PeopleIcon from '@material-ui/icons/People'
import MoneyIcon from '@material-ui/icons/Money'

class Header extends React.Component {

    constructor() {
        super()
        this.state = {
            drawerIsOpen: false
        }
    }

    componentDidMount() {
        const id = this.props.location.pathname.slice(12, 36)

        if (!this.props.user.isLoaded || this.props.user.activeBusiness._id !== id) {
            const business = {
                _id: id
            }
            this.props.dispatch(setActiveBusiness(business))
        }
    }

    toggleDrawer = (open) => {
        this.setState({drawerIsOpen: open})
    } 

    render() {
        return (
        <div className="header">
            
            {this.props.location.pathname.includes('/businesses/') ?
             <>
             <Drawer open={this.state.drawerIsOpen} onClose={() => this.toggleDrawer(false)}>
                <List>
                    <ListItem button>
                        <ListItemIcon><AccountBalanceWalletIcon/></ListItemIcon>
                        <ListItemText primary={'Business'} />
                    </ListItem>
                    
                </List>
                <Divider />
                <List>
                    <ListItem button  onClick={() => {
                        this.toggleDrawer(false)
                        this.props.history.push(`/businesses/${this.props.user.activeBusiness._id}/invoices`)
                    }}>
                        <ListItemIcon><StorefrontIcon/></ListItemIcon>
                        <ListItemText primary={'Invoices'} />
                    </ListItem>
                    <ListItem button  onClick={() => {
                        this.toggleDrawer(false)
                        this.props.history.push(`/businesses/${this.props.user.activeBusiness._id}/orders`)
                    }}>
                        <ListItemIcon><ShoppingBasketIcon/></ListItemIcon>
                        <ListItemText primary={'Orders'} />
                    </ListItem>
                    <ListItem button  onClick={() => {
                        this.toggleDrawer(false)
                        this.props.history.push(`/businesses/${this.props.user.activeBusiness._id}/expenses`)
                    }}>
                        <ListItemIcon><AccountBalanceWalletIcon/></ListItemIcon>
                        <ListItemText primary={'Expenses'} />
                    </ListItem>
                    <ListItem button  onClick={() => {
                        this.toggleDrawer(false)
                        this.props.history.push(`/businesses/${this.props.user.activeBusiness._id}/cashbook`)
                    }}>
                        <ListItemIcon><MoneyIcon/></ListItemIcon>
                        <ListItemText primary={'Cash Book'} />
                    </ListItem>
                    <ListItem button  onClick={() => {
                        this.toggleDrawer(false)
                        this.props.history.push(`/businesses/${this.props.user.activeBusiness._id}/reports`)
                    }}>
                        <ListItemIcon><ShowChartIcon/></ListItemIcon>
                        <ListItemText primary={'Reports'} />
                    </ListItem>
                    <ListItem button  onClick={() => {
                        this.toggleDrawer(false)
                        this.props.history.push(`/businesses/${this.props.user.activeBusiness._id}/teams`)
                    }}>
                        <ListItemIcon><PeopleIcon/></ListItemIcon>
                        <ListItemText primary={'Team'} />
                    </ListItem>
                </List>
             </Drawer>
             <div className="logo">
                <MenuIcon onClick={() => this.toggleDrawer(true)}/>
                <Link to="/businesses"><h1>THRIVE</h1></Link>
             </div>
             </>
             :
             <div className="logo">
                <Link to="/"><h1>THRIVE</h1></Link>
            </div>
            }
            
            <div className="headerLinks">
                {
                    this.props.user.isLoggedIn ? 
                    <div className="headerLinks">
                    <Link to ="/businesses">Businesses</Link>
                    <Link to ="/user">Settings</Link>
                    <Link to ="/" onClick={() => {this.props.dispatch(startUserLogout(this.props.history))}}>Logout</Link>
                    </div>
                    :
                    <div className="headerLinks">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    </div>
                }
            </div>
        </div>
    )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(Header))