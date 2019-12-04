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
            .then(aria => aria.fromRandomMnemonic());

        console.log("address", this.address);
        console.log("network", network);
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

                if (isContentOK && isIdentiyOK && isTrue) {
                    this.canAccess(STATES.valid);
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
                <div className="container">

                <div className="d-flex justify-content-center flex-column">
                    <small className="scan scan--explanation">
                        <span className='scan--explanation--icon'>?</span>
                        Generate a proof of ownership from wallet and scan
                        it</small>

                </div>
                {/*<ValidationBlock state={STATES.valid} title='Is Arianee QR code?' />
                <ValidationBlock state={STATES.unvalid} title='Is Arianee QR code?' />
                <ValidationBlock state={STATES.loading} title='Is Arianee QR code?' />
*/}
                <ValidationBlock state={this.state.qrcodeValid} title='Is Arianee QR code?' />
                <ValidationBlock state={this.state.fetching} title='Can fetch certificate?' />
                <ValidationBlock state={this.state.canAccess} title='Can you access the event?' />
            </div>
            </div>

        )
    }
}


export default withRouter(Scan)
