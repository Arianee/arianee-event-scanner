import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { Arianee, NETWORK } from '@arianee/arianeejs'
import ValidationBlock from '../components/validationBlock';
import {STATES, ErrorCodeMessage} from './state'
import { withRouter } from 'react-router-dom';

class Scan extends Component {

    constructor(props) {
        super(props)
        this.state = this.initialState;
        this.address = this.props.match.params.address;

        this.searchParams = window.location.search.substr(1);
        const network = this.props.match.params.network || NETWORK.mainnet;

        this.wallet = new Arianee().init(network)
            .then(aria => aria.readOnlyWallet());

        console.log("address", this.address);
        console.log("network", network);
        console.log("searchParams",this.searchParams)
    }


    initialState = {
        validityState: STATES.none,
        processing: false,
        message: ErrorCodeMessage.none
    }

    resetState = () => {
        this.setState(this.initialState)

    }

    fetchingSuccess = (fetching) => {
        this.setState({ fetching,canAccess:STATES.loading })
    }


    handleScan = async qrCodeData => {
        if (qrCodeData && this.state.processing !== true) {
            this.setState({validityState: STATES.loading, message:ErrorCodeMessage.loading, processing: true});
            const wallet = await this.wallet;
            let link;

            try {
                link = wallet.utils.readLink(qrCodeData);
                console.log("qrcode: link valid")
            } catch (e) {
                console.log("qrcode: link not valid");
                this.setState({validityState: STATES.unvalid, message:ErrorCodeMessage.linkUnvalid, processing: false});
            }
            if (link) {
                const { issuer, content } = await wallet.methods.getCertificate(link.certificateId, link.passphrase);


                const isIdentiyOK = issuer && issuer.identity && issuer.identity.address === this.address;
                const { isTrue,timestamp } = await wallet.methods.isCertificateProofValid(link.certificateId, link.passphrase);

                let searchParamsIsTrue;

                if (this.searchParams) {
                    if (JSON.stringify(content).indexOf(this.searchParams)>-1) {
                        searchParamsIsTrue = true;
                    } else {
                        searchParamsIsTrue = false;
                    }

                } else {
                    searchParamsIsTrue = true;
                }


                if (true && isIdentiyOK && isTrue && searchParamsIsTrue) {
                    this.setState({validityState: STATES.valid, message:ErrorCodeMessage.success, processing: false});
                } else if(searchParamsIsTrue===false){
                    this.setState({validityState: STATES.unvalid, message:ErrorCodeMessage.notGoodCertificate, processing: false});
                } else if(isIdentiyOK===false){
                    this.setState({validityState: STATES.unvalid, message:ErrorCodeMessage.notFromBrand, processing: false});
                }else if(isTrue===false){
                    this.setState({validityState: STATES.unvalid, message:ErrorCodeMessage.tooOld, processing: false});
                }else {
                    this.setState({validityState: STATES.unvalid, message:ErrorCodeMessage.unknown, processing: false});
                }
                if (this.timer) {
                    clearTimeout(this.timer);
                }
            }
            //this.timer = setTimeout(() => this.resetState(), 3000)
        }
    }

    handleError = err => {
        console.error(err)
    }

    render() {
        return (
            <div className='d-flex flex-column full-height-screen' id='picture-container'>
                <QrReader
                    delay={300}
                    facingMode='environment'
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                />
                <ValidationBlock state={this.state.validityState}/>
                <div className='debug-container'>{this.state.message}</div>
            </div>

        )
    }
}


export default withRouter(Scan)
