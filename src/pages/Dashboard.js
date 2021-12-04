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


class dashboard extends Component {
  constructor(props) {
    super(props);
    this.onDataChange = this.onDataChange.bind(this);
    this.GetInvoiceNo = this.GetInvoiceNo.bind(this);
    this.GetProduct = this.GetProduct.bind(this);
    this.state = {
        pets:[],
        invoiceNo:[],
        products:[],

  };

  }

  componentDidMount() {
    this.unsubscribe = firebase.firestore().collection("Pet").onSnapshot(this.onDataChange);
    this.unsubscribeGetInvoiceNo = firebase.firestore().collection("Invoice").orderBy('InvoiceNo', 'desc').onSnapshot(this.GetInvoiceNo);
    this.unsubscribeGetProduct = firebase.firestore().collection("Product Information").onSnapshot(this.GetProduct);
  }
  GetInvoiceNo(items) {
    let invoiceNo = [];

    items.forEach((item) => {
      invoiceNo.push(item.data());
    });
console.log('invoiceNo: ', invoiceNo)
    this.setState({
                    invoiceNo
                     });
  }

  onDataChange(items) {
    let pets = [];
    items.forEach((item) => {
      pets.push(item.data());
    });
    this.setState({ pets});
  }
  GetProduct(items) {
    let products = [];

    items.forEach((item) => {
      let id = item.id;
      let data = item.data();
      products.push({label: item.data().Category, value: item.data().Category, Code: item.data().Code, Details: item.data().Details, Description: item.data().Description, File: item.data().File, Quantity: item.data().Quantity, UnitPrice: item.data().UnitPrice, id: item.data().id});
    });
console.log('products: ', products)
    this.setState({
        products
                     });
  }
 componentWillUnmount() {
     this.unsubscribeGetInvoiceNo();
     this.unsubscribe();
     this.unsubscribeGetProduct();
  }

  ccyFormat(num) {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
  }

  logout(){
    firebase.auth().signOut().then(()=> {
      console.log('logout')
      this.props.history.push('/')
    }).catch(()=> {
      console.log('err')
    });
  }


  render() {
      let lenghtval = parseInt(this.state.invoiceNo.length)+1;
let invoiceCount =lenghtval<10? '000'+lenghtval:lenghtval<100? '00'+lenghtval:lenghtval<1000? '0'+lenghtval:lenghtval;
   console.log('result: ',lenghtval)

    return (
      <NativeBaseProvider>
      
      <body className="hold-transition sidebar-mini">
	<div className="wrapper">
		<nav className="main-header navbar navbar-expand navbar-light navbar-pink">
			<ul className="navbar-nav">
				<li className="nav-item">
					<a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
				</li>
			</ul>
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<a className="nav-link" data-widget="fullscreen" href="#" role="button">
						<i className="fas fa-expand-arrows-alt"></i>
					</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
						<i className="fas fa-th-large"></i>
					</a>
				</li>
			</ul>
		</nav>

		<aside className="main-sidebar sidebar-dark-primary elevation-4">
			<a href="" className="brand-link">
				<img src="dist/img/logo.jpg" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: 0.8}} />
				<span className="brand-text font-weight-light">P.A.W.S</span>
			</a>
			<div className="sidebar">
				<div className="user-panel mt-3 pb-3 mb-3 d-flex">
					<div className="image">
						<img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
					</div>
					<div className="info">
						<a href="#" className="d-block">STAFF</a>
					</div>
				</div>
				<nav className="mt-2">
					<ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
						<li className="nav-item">
            <Link to={'/dashboard'}>
							<a className="nav-link" style={{backgroundColor: '#e83e8c', color: 'white'}}>
								<i className="nav-icon fas fa-tachometer-alt"></i>
								<p>Dashboard</p>
							</a>
              </Link>
						</li>
						<li className="nav-item menu-open">
							<a href="#" className="nav-link"  style={{backgroundColor: '#e83e8c', color: 'white'}}>
								<i className="nav-icon fas fa-users-cog"></i>
								<p>
									Management
									<i className="fas fa-angle-left right"></i>
									<span className="badge badge-info right"></span>
								</p>
							</a>
							<ul className="nav nav-treeview">
								<li className="nav-item">
                                <Link to={'/appointment'}>
									<a className="nav-link">
										<i className="far fa-circle nav-icon"></i>
										<p>Appointment Schedule</p>
									</a>
                                    </Link>
								</li>
								<li className="nav-item">
                                <Link to={'/customer'}>
									<a href="#" className="nav-link">
										<i className="far fa-circle nav-icon"></i>
										<p>Customer Information</p>
									</a>
                                </Link>
								</li>
								<li className="nav-item">
                                <Link to={'/pet'}>
									<a href="pet-information.html" className="nav-link">
										<i className="far fa-circle nav-icon"></i>
										<p>Pet Information</p>
									</a>
                                    </Link>
								</li>
								<li className="nav-item">
                                <Link to={'/products'}>
									<a className="nav-link">
										<i className="far fa-circle nav-icon"></i>
										<p>Product Information</p>
									</a>
                                    </Link>
								</li>
								<li className="nav-item">
                                <Link to={'/services'}>
									<a className="nav-link">
										<i className="far fa-circle nav-icon"></i>
										<p>Services</p>
									</a>
                                </Link>
								</li>
							</ul>
						</li>
						<li className="nav-item">
                        <Link to={'/sales'}>
							<a className="nav-link" style={{backgroundColor: '#e83e8c', color: 'white'}}>
								<i className="nav-icon fas fa-tachometer-alt"></i>
								<p>Sales</p>
							</a>
                        </Link>
						</li>
						<li className="nav-item">
							<a onClick={()=>this.logout()} className="nav-link" style={{backgroundColor: '#e83e8c', color: 'white'}}>
								<i className="nav-icon fas fa-sign-out-alt"></i>
								<p>Logout</p>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</aside>

		<div className="content-wrapper">
			<section className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1>Dashboard</h1>
						</div>
						<div className="col-sm-6">
							<ol className="breadcrumb float-sm-right">
								<li className="breadcrumb-item"><a href="#">Home</a></li>
								<li className="breadcrumb-item active">Dashboard</li>
							</ol>
						</div>
					</div>
				</div>
			</section>
			<section class="content">
				<div class="container-fluid">
					<div class="row">
						<div class="col-lg-3 col-6">
							<div class="small-box bg-info">
								<div class="inner">
									<h3>{this.state.pets.length}</h3>
									<p>Total Pets</p>
								</div>
								<div class="icon">
									<i class="fa fa-dog"></i>
								</div>
                                <Link to={'/pet'}  class="small-box-footer">
								<a>
									More info <i class="fas fa-arrow-circle-right"></i>
								</a>
                                </Link>
							</div>
						</div>
						<div class="col-lg-3 col-6">
							<div class="small-box bg-primary">
								<div class="inner">
									<h3>{this.state.products.length}</h3>
									<p>Total Pet Products</p>
								</div>
								<div class="icon">
									<i class="fa fa-shopping-bag"></i>
								</div>
                                <Link to={'/products'}  class="small-box-footer">
								<a>
									More info <i class="fas fa-arrow-circle-right"></i>
								</a>
                                </Link>
							</div>
						</div>
						<div class="col-lg-3 col-6">
							<div class="small-box bg-warning">
								<div class="inner">
									<h3>{this.ccyFormat(this.state.invoiceNo.length ? this.state.invoiceNo.reduce((sum, i) => (
														sum += i.Total-i.Discount
													), 0): 0)}</h3>
									<p>Total Income</p>
								</div>
								<div class="icon">
									<i class="fa fa-money-bill-wave"></i>
								</div>
                                <Link to={'/sales'}  class="small-box-footer">
								<a>
									More info <i class="fas fa-arrow-circle-right"></i>
								</a>
                                </Link>
							</div>
						</div>
					</div>
					<div class="row"></div>
				</div>
			</section>
		</div>

		<aside className="control-sidebar control-sidebar-dark">
		</aside>
	</div>
</body>
      </NativeBaseProvider>
    );
  }
}


export default dashboard;
