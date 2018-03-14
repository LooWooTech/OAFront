import React, { Component } from 'react'
import { Provider, observer } from 'mobx-react'
import { RootNavigator } from './navigator'
import { StyleProvider, Root } from 'native-base'
import stores from './stores/index'
import getTheme from '../native-base-theme/components';
import platform from '../native-base-theme/variables/commonColor';
import { MenuProvider } from "react-native-popup-menu";
@observer
class App extends Component {
    render() {
        return (
            <StyleProvider style={getTheme(platform)}>
                <Provider stores={stores}>
                    <Root>
                        <MenuProvider>
                            <RootNavigator />
                        </MenuProvider>
                    </Root>
                </Provider>
            </StyleProvider>
        );
    }
}

export default App;