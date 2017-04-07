/* @flow */

import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Alert,
  Dimensions,
  Animated,
  TouchableOpacity,
  InteractionManager
} from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import Header from '../Component/WYMain/Header';
import Realm from './InitRealm';
import LeftMenu from './LeftMenu';
import ListVideo from '../Component/WYMain/ListVideo';
import FootPlay from '../Component/WYMain/FootPlay'
import Search from '../Component/WYMain/Search';
import PopMenu from '../Component/WYMain/PopMenu';
import ModalView from '../Component/WYMain/ModalView';


import { TabNavigator,DrawerNavigator} from 'react-navigation';




const {width,height} = Dimensions.get('window');
height = height - 120







class MyHomeScreen extends React.Component {
  static navigationOptions = {

  }

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    header:{
      visable:false
    }
  }

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}




const MyApp = TabNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Notifications: {
    screen: MyNotificationsScreen,
  },
}, {
  tabBarPosition:'bottom',
  // swipeEnabled:false,
  // lazyLoad:true,
  // animationEnabled:true,
  tabBarOptions: {
    showLabel:false,
  },
});


class WYMain extends React.PureComponent {

  constructor(props){
    super(props);
    this.state ={
      headerPos:new Animated.Value(0),
      searchPos:new Animated.Value(width),
      view1:true,
      view2:false,
    };
    this.data = {
      serachView : ''
    }
  }

  componentWillMount() {
    // console.warn(global.init);
    global.init = true;
    SplashScreen.hide();
    Realm.InitRealm();

    InteractionManager.runAfterInteractions(()=>{
      this.data.searchView = <Search/>;
    })
  }

  _onSearchDown = () =>{
    this.refs.popmenu.hide(200);
  }

  _popMenuDown = () =>{
    this.refs.popmenu.show(200);
  }

  _onKeyboardHide = () =>{
    this.refs.play.Hide();
  }
  _onKeyboardShow = () =>{
    this.refs.play.Show();
  }

  _onSearchBackDown = () =>{
    Animated.parallel([
      Animated.timing(this.state.headerPos,{
        toValue:0,
        duration:10
      }),
      Animated.timing(this.state.searchPos,{
        toValue:width,
        duration:10
      }),
    ]).start(()=>{
      this.setState({
        view1:true,
        view2:false,
      })
    });
  }

  _headerDown = (i) =>{
    if (i===2) {
      // console.log(this.refs.myapp.navigate('Notifications'));
      this.refs.myapp.props.navigation.navigate('Notifications');
    }
    if (i ===5 ) {
      Animated.parallel([
        Animated.timing(this.state.headerPos,{
          toValue:-width,
          duration:10
        }),
        Animated.timing(this.state.searchPos,{
          toValue:-width,
          duration:10
        }),
      ]).start(()=>{
        this.setState({
          view1:false,
          view2:true,
        })
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{height:height+60,flexDirection:'row'}}>
          {/* 主页部分 */}
          <Animated.View style={{
            transform:[{
              translateX:this.state.headerPos
            }],
            backgroundColor:this.state.view1?'white':'rgba(0,0,0,0)',
            width}}>
            <Header onPress={(i) => {this._headerDown(i)}} navigation={this.props.navigation}/>
            <MyApp ref='myapp'/>
            {/* <ListVideo style={{height,backgroundColor:'rgb(240,240,240)'}}/> */}
          </Animated.View>

          {/* 搜索界面 */}
          <Animated.View style={{
            overflow:'hidden',
            transform:[{
              translateX:this.state.searchPos
            }],
            width,
            backgroundColor:this.state.view2?'white':'rgba(0,0,0,0)',}}>
            <Search style={{flex:1,height:height+60,width,overflow:'hidden',}}
              onSearchDown={this._onSearchDown.bind(this)}
              onSearchBackDown={this._onSearchBackDown.bind(this)}
              onKeyboardHide={this._onKeyboardHide.bind(this)}
              onKeyboardShow={this._onKeyboardShow.bind(this)}
            />
          </Animated.View>

        </View>
        <FootPlay ref='play' onPopMenu={this._popMenuDown.bind(this)}/>
        {/* <ModalView ref='modalview'/> */}
        <PopMenu ref='popmenu' style={{width}}/>
      </View>
    );
  }
}

export default WYMainNavigator = DrawerNavigator({
  Home: {
    screen: WYMain,
  }
},
  {
    drawerWidth:width*0.8,
    contentComponent:LeftMenu,
    contentOptions:{
      style:{
        backgroundColor:'red'
      },
      labelStyle:{
        backgroundColor:'red',
        color:'red'
      }
    }
  }
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'rgb(240,240,240)'
  },
  popmenu:{
    position:'absolute',
    height:300,
    backgroundColor:'white',
  }
});
