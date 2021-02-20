import React, { Component } from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";

import "assets/css/material-dashboard-react.css?v=1.9.0";
import "./styles.css";


import RideManager from "./contracts/RideManager.json";
import Web3 from 'web3';


const hist = createBrowserHistory();

class App extends Component {
    constructor () {
        super();
        this.state = {
            'account': null,
            'rideManager': null,
            'loading': true,
            'web3': null,
        }
    }

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockChain()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }

    handleInputChange = (e) => {
        this.setState({
            [ e.target.id ]: e.target.value,
        })
    }

    async loadBlockChain() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);
        this.setState({ 'account': accounts[ 0 ] });
        const networkId = await web3.eth.net.getId();
        const networkData = RideManager.networks[ networkId ];
        if (networkData) {
            const rideManager = new web3.eth.Contract(RideManager.abi, networkData.address);
            this.setState({ 'rideManager': rideManager, 'loading': false, 'web3': web3 });
        } else {
            window.alert('Ride Manager contract not deployed to detected network.');
        }
    }

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <Router history={hist}>
                <Switch>
                    <Route
                        path="/admin"
                        render={(props) => (
                            <Admin rideManager={this.state.rideManager} web3={this.state.web3} account={this.state.account}/>
                        )}
                    />
                    <Redirect from="/" to="/admin/dashboard" />
                </Switch>
            </Router>
        );
    }
}

export default App;
