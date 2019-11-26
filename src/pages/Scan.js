import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import { Arianee, NETWORK } from '@arianee/arianeejs'
import ValidationBlock from '../components/validationBlock';
import { STATES } from './state'
import { withRouter } from 'react-router-dom';
import {getList,pushNewToken,reset,isEntered} from '../services/event-storage'
class Scan extends Component {

    constructor(props) {
        super(props)
        this.state = this.initialState;
        this.address = this.props.match.params.address;

        const searchParams = new URLSearchParams(window.location.search)
        const network = this.props.match.params.network || NETWORK.mainnet;

        this.wallet = new Arianee().init(network)
            .then(aria => aria.fromRandomMnemonic());

        console.log("address", this.address);
        console.log("network", network);
    }


    createNewEvent=()=>{
        reset();
    }

    initialState = {
        qrcodeValid: STATES.none,
        fetching: STATES.none,
        canAccess: STATES.none
    }

    resetState = () => {
        this.setState(this.initialState)
    }

    validQrCode = (qrcodeValid) => {
        this.setState({ qrcodeValid })
    }


    canAccess = (canAccess) => {
        this.setState({ canAccess })
    }

    fetchingSuccess = (fetching) => {
        this.setState({ fetching })
    }


    handleScan = async qrCodeData => {
        if (qrCodeData) {
            this.resetState()
            this.validQrCode(STATES.loading);
            const wallet = await this.wallet;
            let link
            try {
                link = wallet.utils.readLink(qrCodeData);
                this.validQrCode(STATES.valid);
            } catch (e) {
                this.validQrCode(STATES.unvalid);
                this.canAccess(false);
            }
            if (link) {
                this.fetchingSuccess(STATES.loading);
                const { content, issuer } = await wallet.methods.getCertificate(link.certificateId, link.passphrase, { content: true, issuer: true });
                this.fetchingSuccess(STATES.valid);

                const isContentOK = content && content.isAuthentic;
                const isIdentiyOK = issuer && issuer.identity && issuer.identity.address === this.address;
                const { isTrue } = await wallet.methods.isCertificateProofValid(link.certificateId, link.passphrase);

                const isNotAlreadyEntered= isEntered(link.certificateId);

                if (isContentOK && isIdentiyOK && isTrue&& isNotAlreadyEntered) {
                    this.canAccess(STATES.valid);
                    pushNewToken(link.certificateId);
                } else {
                    this.canAccess(STATES.unvalid);
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
                <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                />
                <ValidationBlock state={this.state.qrcodeValid} title='qrcode' />
                <ValidationBlock state={this.state.fetching} title='certificate' />
                <ValidationBlock state={this.state.canAccess} title='can access' />
                <button onClick={this.createNewEvent}>Create new event</button>
            </div>
        )
    }
}


export default withRouter(Scan)
