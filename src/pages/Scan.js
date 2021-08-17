import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { Arianee, NETWORK } from '@arianee/arianeejs'
import ValidationBlock from '../components/validationBlock';
import { STATES } from './state'
import { withRouter } from 'react-router-dom';

class Scan extends Component {

    constructor(props) {
        super(props)
        this.state = this.initialState;
        this.address = this.props.match.params.address;

        const searchParams = new URLSearchParams(window.location.search)
        const network = this.props.match.params.network || NETWORK.mainnet;

        this.wallet = new Arianee().init(network)
            .then(aria => aria.readOnlyWallet());

        console.log("address", this.address);
        console.log("network", network);
    }


    initialState = {
        validityState: STATES.none,
        processing: false
    }

    resetState = () => {
        this.setState(this.initialState)
    }

    fetchingSuccess = (fetching) => {
        this.setState({ fetching,canAccess:STATES.loading })
    }


    handleScan = async qrCodeData => {
        if (qrCodeData && this.state.processing === false) {
            this.setState({validityState: STATES.loading, processing: true});
            const wallet = await this.wallet;
            let link;

            try {
                link = wallet.utils.readLink(qrCodeData);
            } catch (e) {
                this.setState({validityState: STATES.unvalid});
            }
            if (link) {
                const { issuer } = await wallet.methods.getCertificate(link.certificateId, link.passphrase, { issuer: {waitingIdentity:true} });

                const isIdentiyOK = issuer && issuer.identity && issuer.identity.address === this.address;
                const { isTrue,timestamp } = await wallet.methods.isCertificateProofValid(link.certificateId, link.passphrase);

                if (true && isIdentiyOK && isTrue) {
                    this.setState({validityState: STATES.valid});
                } else {
                    this.setState({validityState: STATES.unvalid});
                }
                if (this.timer) {
                    clearTimeout(this.timer);
                }
            }
            this.timer = setTimeout(() => this.resetState(), 5000)
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
                    facingMode='user'
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                />
                <ValidationBlock state={this.state.validityState}/>
            </div>

        )
    }
}


export default withRouter(Scan)
