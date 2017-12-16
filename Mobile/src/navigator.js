import React, { Component } from 'react'
import { Image, Text } from 'react-native'
import { StackNavigator, TabNavigator, NavigationActions, StackRouter } from 'react-navigation'
import { Icon } from 'antd-mobile'
import WelcomePage from './views/home/welcome'
import HomeTab from './views/home/index'
import MessageTab from './views/message/list'

//首页tab导航 
const HomePage = TabNavigator(
    {
        Home: {
            screen: HomeTab,
            navigationOptions: {
                tabBarLabel: '首页',
                tabBarIcon: ({ tintColor }) => (
                    <Icon type={'\ue65e'} color={tintColor} />
                ),
                onNavigationStateChange: (() => alert("首页")),
                // initialRouteName:'IndexScreen' 
            }
        },
        Message: {
            screen: MessageTab,
            navigationOptions: {
                tabBarLabel: '消息',
                tabBarIcon: ({ tintColor }) => (
                    <Icon type={'\ue677'} color={tintColor} />
                ),
                // initialRouteName:'MeScreen' 
            }
        }
    },
    {
        animationEnabled: true, // 切换页面时是否有动画效果 
        tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的 
        swipeEnabled: true, // 是否可以左右滑动切换tab 
        tabBarOptions: {
            activeTintColor: '#2196f3', // 文字和图片选中颜色 
            inactiveTintColor: '#999', // 文字和图片未选中颜色 
            showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示 
            indicatorStyle: {
                height: 0 // 如TabBar下面显示有一条线，可以设高度为0后隐藏 
            },
            style: {
                backgroundColor: '#fff', // TabBar 背景色 
                height: 60
            },
            labelStyle: {
                fontSize: 14, // 文字大小 
                marginTop: 2
                // lineHeight:44 
            },
        }
    }
);

//欢迎页导航
export const RootNavigator = StackNavigator(
    {
        Welcome: { screen: WelcomePage, },
        Home: { screen: HomePage, },
    },
    {
        initialRouteName: 'Welcome',
        headerMode: 'none',
        onTransitionStart: (Start) => { console.log('导航栏切换开始'); }, // 回调 
        onTransitionEnd: () => { console.log('导航栏切换结束'); } // 回调 
    }
)