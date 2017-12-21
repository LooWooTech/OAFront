import React, { Component } from 'react'
import { Provider, observer } from 'mobx-react'
import { RootNavigator } from './navigator'
import { StyleProvider } from 'native-base'
import stores from './stores/index'
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/commonColor';

@observer
class App extends Component {
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Provider stores={stores}>
                    <RootNavigator />
                </Provider>
            </StyleProvider>
        );
    }
}

export default App;