import React, { Component }  from "react";
import QrReader from 'react-qr-scanner'

export default class QrScanner extends Component {
    constructor(props){
      super(props)
      this.state = {
        delay: 100,
        result: 'No result',
      }
  
      this.handleScan = this.handleScan.bind(this)
    }
    handleScan(data){
      this.setState({
        result: data,
      })
    }
    handleError(err){
      console.error(err)
    }
    render(){
      const previewStyle = {
        height: 800,
        width: 800,
      }
  
      return(
        <div>
          <QrReader
            delay={this.state.delay}
            style={previewStyle}
            onError={this.handleError}
            onScan={this.handleScan}
            />
          <h1>{this.state.result}</h1>
        </div>
      )
    }
  }