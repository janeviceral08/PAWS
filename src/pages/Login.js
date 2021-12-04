import React, { Component } from 'react';
import { Link,withRouter } from 'react-router-dom';
import { FaEnvelope,FaLock, FaUserShield, FaUserCog , FaMobileAlt, FaGlobeAsia, FaHome, FaUserAlt, FaRegAddressCard, FaIdCard} from "react-icons/fa";
import { FcShop, FcLock, FcManager,FcTabletAndroid, FcFeedback, FcGlobe, FcGallery } from "react-icons/fc";
import { GoEyeClosed,GoEye } from "react-icons/go";
import { BiReset } from "react-icons/bi";

import { Input, Icon, Stack, NativeBaseProvider,Radio, FlatList,Box,TextArea,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,Pressable,Modal,Button,Checkbox,Heading
    } from "native-base"
    import axios from 'axios'
import cogoToast from 'cogo-toast';
import Select from 'react-select';
import firebase from "./firebase";
import ClipLoader from "react-spinners/ClipLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
    MdDelete,
    MdAddBox,
    MdDoDisturbOn, } from "react-icons/md";
import moment from 'moment';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        email:'',
        password:'',

  };

  }


  
  componentDidMount() {
  let userId =  firebase.auth().currentUser;
  console.log('userId: ', userId)
if(userId!=null){
    this.props.history.push('/dashboard')
}


  }
  Login() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((info)=>    this.props.history.push('/dashboard'))
    .catch((err)=> console.log('err: ', err))
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
};


  render() {

    return (
      <body  style={{'background': 'linear-gradient(to top left, #33ccff 0%, #ff99cc 100%)'}}>
     	<div className="center"  style={{marginBottom: "auto", marginTop: '22%',}}>
		<div className="ear ear--left"></div>
		<div className="ear ear--right"></div>
		<div className="face">
			<div className="eyes">
				<div className="eye eye--left">
					<div className="glow"></div>
				</div>
				<div className="eye eye--right">
					<div className="glow"></div>
				</div>
			</div>
			<div className="nose">
				<svg width="38.161" height="22.03">
					<path d="M2.017 10.987Q-.563 7.513.157 4.754C.877 1.994 2.976.135 6.164.093 16.4-.04 22.293-.022 32.048.093c3.501.042 5.48 2.081 6.02 4.661q.54 2.579-2.051 6.233-8.612 10.979-16.664 11.043-8.053.063-17.336-11.043z" fill="#243946"></path>
				</svg>
				<div className="glow"></div>
			</div>
			<div className="mouth">
				<svg className="smile" viewBox="-2 -2 84 23" width="84" height="23">
					<path d="M0 0c3.76 9.279 9.69 18.98 26.712 19.238 17.022.258 10.72.258 28 0S75.959 9.182 79.987.161" fill="none" stroke-width="3" stroke-linecap="square" stroke-miterlimit="3"></path>
				</svg>
				<div className="mouth-hole"></div>
				<div className="tongue breath">
					<div className="tongue-top"></div>
					<div className="line"></div>
					<div className="median"></div>
				</div>
			</div>
		</div>
		<div className="hands">
			<div className="hand hand--left">
				<div className="finger">
					<div className="bone"></div>
					<div className="nail"></div>
				</div>
				<div className="finger">
					<div className="bone"></div>
					<div className="nail"></div>
				</div>
				<div className="finger">
					<div className="bone"></div>
					<div className="nail"></div>
				</div>
			</div>
			<div className="hand hand--right">
				<div className="finger">
					<div className="bone"></div>
					<div className="nail"></div>
				</div>
				<div className="finger">
					<div className="bone"></div>
					<div className="nail"></div>
				</div>
				<div className="finger">
					<div className="bone"></div>
					<div className="nail"></div>
				</div>
			</div>
		</div>
		<div className="login">
			<label>
				<div className="fa fa-user"></div>
				<input type="email" id="inputEmail" className="form-control" name="email" onChange={this.onChange} placeholder="Username"/>                   
			</label>
			<label>
				<div className="fa fa-key"></div>
				<input type="password" id="inputPassword" className="form-control" name="password" onChange={this.onChange} placeholder="Password"/>
			</label>
			<button className="login-button" onClick={()=>this.Login()}>Sign in</button>
		</div>
		<div className="social-buttons">
			<div className="social">
				<div className="fa fa-paw"></div>
			</div>
		</div>
	</div>
      </body>
    );
  }
}


export default Login;
