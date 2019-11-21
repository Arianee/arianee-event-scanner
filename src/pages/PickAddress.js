import React, { Component } from 'react'
import { Arianee, NETWORK } from '@arianee/arianeejs'
import { withRouter } from 'react-router-dom';


class PickAddress extends Component {

    constructor(props) {
        super(props)
        this.state = { addresses: [] };

        this.wallet = new Arianee().init(NETWORK.mainnet)
            .then(aria => aria.fromRandomMnemonic());
        this.getAddressAutocomplete();

    }

    selectAddress = (event) => {
        const address = event.target.value;
        this.props.history.push(`/scan/${address}`)
    }

    getAddressAutocomplete = async () => {
        const wallet1 = await this.wallet;

        const events = await wallet1.contracts.identityContract.getPastEvents("AddressApprovedAdded", { fromBlock: 1 });
        //console.log(events)
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
            <div>
                {this.state.addresses.length === 0 && <div className="lds-hourglass"></div>}
                {this.state.addresses.length > 0
                    && <select onChange={this.selectAddress}>
                        {this.state.addresses.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                }
            </div>
        )
    }
}

export default withRouter(PickAddress)