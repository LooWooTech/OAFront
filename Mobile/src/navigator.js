import { StackNavigator, TabNavigator, NavigationActions, StackRouter } from 'react-navigation'
import Welcome from './views/home/welcome'
import HomePage from './views/home/index'
import Search from './views/search/index'
import Settings from './views/home/settings'
import Messages from './views/message/index'
import MissvieList from './views/missive/index'
import MissiveDetail from './views/missive/detail'
import FilePreview from './views/file/preview'
import FreeFlowForm from './views/freeflow/form'
import FlowForm from './views/flow/form'
import SelectUser from './views/shared/SelectUser'

const Index = TabNavigator(
    {
        Home: { screen: HomePage, },
        Messages: { screen: Messages },
    },
    {
        tabBarPosition: 'bottom',
        lazy: true,
        backBehavior: 'none',
        animationEnabled: true,
        tabBarOptions: {
            activeTintColor: '#108ee9',
            inactiveTintColor: '#333',
            showIcon: true,
            showLabel: true,
            upperCaseLabel: false,
            pressOpacity: 0.8,
            style: {
                backgroundColor: '#fff',
                paddingBottom: 0,
                borderTopWidth: 0.5,
                borderTopColor: '#ccc',
            },
            labelStyle: {
                fontSize: 12,
                margin: 1
            },
            indicatorStyle: { height: 0 },
        },
    }
)

export const RootNavigator = StackNavigator(
    {
        Welcome: { screen: Welcome },
        Index: { screen: Index },
        Settings: { screen: Settings },
        'Missive.List': { screen: MissvieList },
        'Missive.Detail': { screen: MissiveDetail },
        'File.Preview': { screen: FilePreview },
        'Flow.Form': { screen: FlowForm },
        'FreeFlow.Form': { screen: FreeFlowForm },
        'SelectUser': { screen: SelectUser }
    },
    {
        initialRouteName: 'Welcome',
        headerMode: 'none',
    }
)