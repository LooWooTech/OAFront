import React, { Component } from 'react'
import { Image, Text } from 'react-native'
import { StackNavigator, TabNavigator, NavigationActions, StackRouter } from 'react-navigation'
import { Badge, Icon } from 'antd-mobile'
import HomeWelcome from './views/home/welcome'
import HomeIndex from './views/home/index'
import MessageList from './views/message/list'

export const RootNavigator = StackNavigator(
    {
        Welcome: { screen: HomeWelcome },
        Home: { screen: HomeIndex, },
        MessageList: { screen: MessageList }
    },
    {
        initialRouteName: 'Welcome',
    }
)