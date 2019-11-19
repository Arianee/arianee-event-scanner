import React, {Component} from 'react'
import QrReader from 'react-qr-reader'
import {Arianee, NETWORK} from '@arianee/arianeejs'
import ValidationBlock from './validationBlock';
import {STATES} from './state'

class Test extends Component {

    constructor(props){
        super(props)
        this.state=this.initialState;
        const searchParams = new URLSearchParams(window.location.search)
        this.address=searchParams.get('brand');
        const network=searchParams.get('network') || NETWORK.mainnet;

        this.wallet = new Arianee().init(network)
            .then(aria=>aria.fromRandomMnemonic());

        console.log("address",this.address);
        console.log("network",network);

    }

    initialState={
        qrcodeValid:STATES.none,
        fetching:STATES.none,
        canAccess:STATES.none
    }

    resetState=()=>{
        this.setState(this.initialState)
    }

    validQrCode=(qrcodeValid)=>{
        this.setState({qrcodeValid})
    }


    canAccess=(canAccess)=>{
        this.setState({canAccess})
    }

    fetchingSuccess=(fetching)=>{
        this.setState({fetching})
    }


    handleScan =async qrCodeData => {
      if (qrCodeData) {
          this.resetState()
          this.validQrCode(STATES.loading);
          const wallet=await this.wallet;
          let link
          try{
              link=wallet.utils.readLink(qrCodeData);
            this.validQrCode(STATES.valid);
          }catch (e) {
              this.validQrCode(STATES.unvalid);
              this.canAccess(false);
          }
          if(link){
              this.fetchingSuccess(STATES.loading);
              const {content,issuer}=await wallet.methods.getCertificate(link.certificateId,link.passphrase,{content:true,issuer:true});
              this.fetchingSuccess(STATES.valid);
              if(content.isAuthentic && issuer.identity.address===this.address){
                  this.canAccess(STATES.valid);
              }else{
                  this.canAccess(STATES.valid);
              }
          }
    }
  }

  handleError = err => {
    console.error(err)
  }

  render() {
    return (
        <div>
          <div>
            <input placeholder='please enter public key'/>
          </div>
          <QrReader
              delay={300}
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: '100%' }}
          />
            <ValidationBlock state={ this.state.qrcodeValid} title='qrcode'/>
            <ValidationBlock state={ this.state.fetching} title='certificate'/>
            <ValidationBlock state={ this.state.canAccess} title='can access'/>
        </div>
    )
  }
}

class TestImpl extends Test {
}

export default Test;
