import React, { Component } from 'react'
import { Provider, observer } from 'mobx-react'
import { RootNavigator } from './navigator'

import stores from './stores/index'

@observer
class App extends Component {
    render() {
        return (
            <Provider stores={stores}>
                <RootNavigator />
            </Provider>
        );
    }
}

export default App;