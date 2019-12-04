import React, { Component } from 'react'
import { Arianee, NETWORK } from '@arianee/arianeejs'
import { withRouter } from 'react-router-dom';
import Loader from '../components/Loader'

class PickAddress extends Component {

    constructor(props) {
        super(props)
        this.state = { addresses: [] };


    }

    selectNetwork = (network) => {
        this.setState({
            network,
            addresses: []
        });

        this.getAddressAutocomplete(network);
    }

    selectAddress = (address) => {
        const { network } = this.state;
        this.props.history.push(`/scan/${address}/${network}`)
    }

    getAddressAutocomplete = async (network) => {

        const wallet = new Arianee().init(network)
            .then(aria => aria.fromRandomMnemonic());

        const wallet1 = await wallet;

        const events = await wallet1.contracts.identityContract.getPastEvents("AddressApprovedAdded", { fromBlock: 1 });
        const approvedAddress = events.map(d => d.returnValues._newIdentity);

        const ids = approvedAddress.map(address => wallet1.methods.getIdentity(address));

        const promiseIDs = await Promise.all(ids);
        const tuples = promiseIDs
            .filter(id => id.data)
            .map(id => ({ id: id.address, name: id.data.name }))

        this.setState({
            addresses: tuples
        });
    }

    render() {
        return (
            <div className='d-flex justify-content-center flex-column'>
                <div className="btn-group btn-group-toggle">
                    {Object.values(NETWORK).map(network => <div
                        className={this.state.network === network ? "btn btn-secondary active" : "btn btn-secondary"}
                        onClick={() => this.selectNetwork(network)} key={network} value={network}>{network}</div>)}
                </div>
                {this.state.network &&
                    <div className="d-flex justify-content-center flex-column align-items-center">
                        {this.state.addresses.length === 0 && <Loader title='fetching identities'/>}
                        {this.state.addresses.length > 0
                            && this.state.addresses.map(opt => {
                                return <div
                                    data-address={opt.id}
                                    className="btn btn-outline-warning btn-lg btn-block border-primary p-2 mt-2"
                                    onClick={() => this.selectAddress(opt.id)} key={opt.id}>
                                    {opt.name}
                                </div>
                            })
                        }
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(PickAddress)
