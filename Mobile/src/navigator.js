import React, { Component } from 'react'
import { Image, Text } from 'react-native'
import { StackNavigator, TabNavigator, NavigationActions, StackRouter } from 'react-navigation'
import { Badge, Icon } from 'antd-mobile'
import Welcome from './views/home/welcome'
import HomePage from './views/home/index'
import Settings from './views/home/settings'
import Messages from './views/message/index'

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
    },
    {
        initialRouteName: 'Welcome',
    }
)