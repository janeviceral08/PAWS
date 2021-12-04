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
import ReactPaginate from 'react-paginate';

class sales extends Component {
  constructor(props) {
    super(props);
    this.onDataChange = this.onDataChange.bind(this);
    this.GetInvoiceNo = this.GetInvoiceNo.bind(this);
    this.GetService = this.GetService.bind(this);
    this.GetProduct = this.GetProduct.bind(this);
    this.GetCartService = this.GetCartService.bind(this);
    this.GetCartProduct = this.GetCartProduct.bind(this);
    this.state = {
    modalVisible:false,
    startDate:new Date(),
    customers:[],
    invoiceNo: [],
    typeRadio:true,
    products:[],
    services:[],
    selectedcustomers :null,
    selectedproducts :null,
    selectedservices :null,
    cost:1,
    CartService:[],
    CartProduct:[],
    pqty: '1', 
    pprice: '0',
    Discount:'0',
    
    pageCount:10,
    perPage:10,
    offset: 0,
    currentPage: 0,
    orgtableData:[],
  };
  this.handlePageClick = this.handlePageClick.bind(this);
  }
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
        currentPage: selectedPage,
        offset: offset
    }, () => {
        this.loadMoreData()
    });

};

loadMoreData() {
  const data = this.state.orgtableData;
  
  const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
  this.setState({
    pageCount: Math.ceil(data.length / this.state.perPage),
    invoiceNo:slice
  })

  }

  componentDidMount() {
    this.unsubscribe = firebase.firestore().collection("customers").onSnapshot(this.onDataChange);
    this.unsubscribeGetInvoiceNo = firebase.firestore().collection("Invoice").orderBy('InvoiceNo', 'desc').onSnapshot(this.GetInvoiceNo);
    this.unsubscribeGetService = firebase.firestore().collection("Services").onSnapshot(this.GetService);
    this.unsubscribeGetProduct = firebase.firestore().collection("Product Information").onSnapshot(this.GetProduct);
    this.unsubscribeGetCartService = firebase.firestore().collection("CartService").onSnapshot(this.GetCartService);
    this.unsubscribeGetCartProduct = firebase.firestore().collection("CartProduct").onSnapshot(this.GetCartProduct);
  }

  GetCartProduct(items) {
    let CartProduct = [];

    items.forEach((item) => {
      let id = item.id;
      let data = item.data();
      CartProduct.push(item.data());
    });
console.log('CartProduct: ', CartProduct)
    this.setState({
        CartProduct
                     });
  }
  GetCartService(items) {
    let CartService = [];

    items.forEach((item) => {
      let id = item.id;
      let data = item.data();
      CartService.push(item.data());
    });
console.log('CartService: ', CartService)
    this.setState({
        CartService
                     });
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
  GetService(items) {
    let services = [];

    items.forEach((item) => {
      let id = item.id;
      let data = item.data();
      services.push({label: item.data().Description, value: item.data().Description, Code: item.data().Code, ServiceFee: item.data().ServiceFee, Category: item.data().Category});
    });
console.log('services: ', services)
    this.setState({
        services
                     });
  }
  GetInvoiceNo(items) {
    let invoiceNo = [];

    items.forEach((item) => {
      let id = item.id;
      let data = item.data();
      invoiceNo.push({datas: item.data(),  searchText: item.data().Discount.toString() + ' '+ item.data().Total.toString() + ' '+item.data().invoiceCount+ ' '+ item.data().Customer.email+ ' '+ item.data().Customer.label});
    });
console.log('invoiceNo: ', invoiceNo)
var slice = invoiceNo.slice(this.state.offset, this.state.offset + this.state.perPage)

this.setState({ invoiceNo:slice ,   pageCount: Math.ceil(invoiceNo.length / this.state.perPage), orgtableData : invoiceNo,});
    this.setState({
                    invoiceNo
                     });
  }

  onDataChange(items) {
    let customers = [];

    items.forEach((item) => {
      let id = item.id;
      let data = item.data();
      customers.push({label: item.data().fullName, value: item.data().fullName, address: item.data().address, email: item.data().email, firstName: item.data().firstName, id:item.data().id ,lastName:item.data().lastName, middleName:item.data().middleName, mobile:item.data().mobile,password:item.data().password,});
    });
console.log('customers: ', customers)
    this.setState({
                    customers
                     });
  }


 componentWillUnmount() {
     this.unsubscribeGetInvoiceNo();
     this.unsubscribe();
     this.unsubscribeGetService();
     this.unsubscribeGetProduct();
     this.unsubscribeGetCartService();
     this.unsubscribeGetCartProduct();
  }

  ccyFormat(num) {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
  }
  handleChangecustomers= (selectedcustomers) => {
    this.setState({ selectedcustomers });
  };
  handleChangeservice= (selectedservices) => {
    this.setState({ selectedservices, cost:selectedservices.ServiceFee });
  };
  handleChangeproduct= (selectedproducts) => {
    this.setState({ selectedproducts,pprice:selectedproducts.UnitPrice  });
  };
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
};

  AddService(){
      console.log('this.state.selectedservices: ', this.state.selectedservices)
      if(this.state.selectedservices == null){
        cogoToast.error('Please enter service');
        return;
      }
      else{
        const newDocumentID =  firebase.firestore().collection('CartProduct').doc().id;
    firebase.firestore().collection("CartService").doc(newDocumentID).set({
        id:newDocumentID,
        Category: this.state.selectedservices.Category,
        Code: this.state.selectedservices.Code,
        ServiceFee: this.state.selectedservices.ServiceFee,
        Description: this.state.selectedservices.label,
        cost:this.state.cost,
     
            });
        }
  }

  AddProduct(){
    console.log('this.state.selectedservices: ', this.state.selectedservices)
    if(this.state.selectedproducts == null){
      cogoToast.error('Please enter product');
      return;
    }
    else{
      
        firebase.firestore().collection("Product Information").doc(this.state.selectedproducts.id).update({Quantity: firebase.firestore.FieldValue.increment(-parseFloat(this.state.pqty))})
        const newDocumentID =  firebase.firestore().collection('CartProduct').doc().id;
        const dataValue={
            id:newDocumentID,
            ProductId: this.state.selectedproducts.id,
            Category: this.state.selectedproducts.value,
            Code: this.state.selectedproducts.Code,
            Details: this.state.selectedproducts.Details,
            Description: this.state.selectedproducts.Description,
            UnitPrice:this.state.selectedproducts.UnitPrice,
            pqty:parseFloat(this.state.pqty),
            pprice:this.state.pprice,
         
                }
                console.log('dataValue: ', dataValue)
  firebase.firestore().collection("CartProduct").doc(newDocumentID).set(dataValue);
      }
}



TotalAmountService(){
    let total = 0
  this.state.CartService.forEach((item) => {

    total += parseFloat(item.cost) 
  
})
console.log('TotalAmountService: ',total)
return total;
  }
  TotalAmountProduct(){
    let total = 0
  this.state.CartProduct.forEach((item) => {

    total += parseFloat(item.pqty)*parseFloat(item.pprice)
  
})
console.log('TotalAmountProduct: ',total)
return total;
  }
  resetData(){

    let total = 0
  this.state.CartService.forEach((item) => {
    firebase.firestore().collection('CartService').doc(item.id).delete();
        })
    this.state.CartProduct.forEach((item) => {
        firebase.firestore().collection("Product Information").doc(item.ProductId).update({Quantity: firebase.firestore.FieldValue.increment(parseFloat(item.pqty))})
        firebase.firestore().collection('CartProduct').doc(item.id).delete();
        })
  }

  descrease(item){

        firebase.firestore().collection("Product Information").doc(item.id).update({Quantity: firebase.firestore.FieldValue.increment(1)})
        firebase.firestore().collection('CartProduct').doc(item.id).update({pqty: firebase.firestore.FieldValue.increment(-1)})
   
  }
  increase(item){

    firebase.firestore().collection("Product Information").doc(item.id).update({Quantity: firebase.firestore.FieldValue.increment(-1)})
    firebase.firestore().collection('CartProduct').doc(item.id).update({pqty: firebase.firestore.FieldValue.increment(1)})

}
deleteItem(item){

    firebase.firestore().collection("Product Information").doc(item.id).update({Quantity: firebase.firestore.FieldValue.increment(1)})
    firebase.firestore().collection('CartProduct').doc(item.id).delete()

}
deleteItemService(item){

    firebase.firestore().collection('CartService').doc(item.id).delete()

}

saveInvoice(){
    if(this.state.selectedcustomers == null){
        cogoToast.error('Please enter Customer');
        return;
      }
    if(this.state.CartProduct.length < 1 && this.state.CartService.length < 1){
        cogoToast.error('Cart is Empty');
        return;
      }
      else
        {       
          let lenghtval = parseInt(this.state.invoiceNo.length)+1;
          let invoiceCount =lenghtval<10? '000'+lenghtval:lenghtval<100? '00'+lenghtval:lenghtval<1000? '0'+lenghtval:lenghtval;
            
            cogoToast.loading('Saving...').then(() => { 
            const newDocumentID =  firebase.firestore().collection('Invoice').doc().id;
            firebase.firestore().collection("Invoice").doc(newDocumentID).set({
                id:newDocumentID,
                CustomerID:this.state.selectedcustomers.id,
                Customer:this.state.selectedcustomers,
                Product: this.state.CartProduct,
                Service: this.state.CartService,
                Total:parseFloat(this.TotalAmountService())+parseFloat(this.TotalAmountProduct()),
                invoiceCount:invoiceCount,
                timestamp: moment().unix(),
                InvoiceNo: lenghtval+1,
                Discount: parseFloat(this.state.Discount),
             
                    });
  this.state.CartService.forEach((item) => {
    firebase.firestore().collection('CartService').doc(item.id).delete();
        })
    this.state.CartProduct.forEach((item) => {

        firebase.firestore().collection('CartProduct').doc(item.id).delete();
        })
        cogoToast.success('Data Successfully Saved');
});
    }
  }

  logout(){
    firebase.auth().signOut().then(()=> {
      console.log('logout')
      this.props.history.push('/')
    }).catch(()=> {
      console.log('err')
    });
  }


  searchInv = event => {
    const newData = this.state.orgtableData.filter(item => {
      const itemData = item.searchText.toUpperCase();
      const textData = event.target.value.toUpperCase();
       
      return itemData.indexOf(textData) > -1
      });
      var slice = newData.slice(this.state.offset, this.state.offset + this.state.perPage)
  
      this.setState({ invoiceNo:slice });
  
  console.log('newData: ',newData)
  /*	if([event.target.name]=='noEntries'){
      }else{
    this.setState({ [event.target.name]: event.target.value });}*/
  };
  



  render() {
      let lenghtval = parseInt(this.state.invoiceNo.length)+1;
let invoiceCount =lenghtval<10? '000'+lenghtval:lenghtval<100? '00'+lenghtval:lenghtval<1000? '0'+lenghtval:lenghtval;
   console.log('result: ',lenghtval)

    return (
      <NativeBaseProvider>
          <Modal
        isOpen={this.state.modalVisible}
        onClose={() =>this.setState({modalVisible: false})}
        size={'xl'}
      >
        <Modal.Content style={{marginBottom: "auto", marginTop: 60}}>
          <Modal.CloseButton />
          <Modal.Header>Add Sales   <Text bold>Invoice#: INV-{invoiceCount}</Text></Modal.Header>
          <Modal.Body>
          <div className="card card-primary">
												<div className="card-body">
													<div className="row">
														<div className="col-4">
															<div className="form-group">
																<label>Date</label>
                                                                <DatePicker  className="form-control" selected={this.state.startDate} onChange={(date) => this.setState({startDate:date})} />
															</div>
														</div>
														<div className="col-5">
															<div className="form-group">
																<label>Customer Name</label>
                                                                <Select
                            value={this.state.selectedcustomers}
                            placeholder={'Customer'}
                            onChange={this.handleChangecustomers}
                            options={this.state.customers}
                            style={{width: '100%'}}
                          />
															
															</div>
														</div>
														<div className="col-3">
															<div className="form-group">
																<label>Type</label>
                                                                <p></p>
                                                                <input type="radio"   onChange={()=>this.setState({typeRadio: true})} checked={this.state.typeRadio == true? true: false}/> Services
                                                                <p></p>
                                                                <input type="radio" onChange={()=>this.setState({typeRadio: false})}  checked={this.state.typeRadio == false? true: false}/> Products
                       
															</div>
														</div>
                                                        <div className="col-5"  style={{display: this.state.typeRadio ==true? 'block': 'none'}}>
															<div className="form-group">
																<label>Sevice</label>
																<Select
                            value={this.state.selectedservices}
                            placeholder={'Service'}
                            onChange={this.handleChangeservice}
                            options={this.state.services}
                            style={{width: '100%'}}
                          />
															</div>
														</div>  
														<div className="col-5"  style={{display: this.state.typeRadio ==true? 'block': 'none'}}>
															<div className="form-group">
																<label>Cost</label>
																<input type="number" className="form-control" row="5" name="cost" value={this.state.cost} onChange={this.onChange} placeholder="Enter Quantity"/>
															</div>
														</div>
														                           
														<div className="col-2"  style={{display: this.state.typeRadio ==true? 'block': 'none'}}>
                                                        <button className="btn btn-primary" onClick={()=> this.AddService()}>
														<i className="fa fa-plus"></i> Add
													</button>
														</div>
                                                        <div className="col-4" style={{display: this.state.typeRadio ==false? 'block': 'none'}}>
															<div className="form-group">
																<label>Product</label>
                                                                <Select
                            value={this.state.selectedproducts}
                            placeholder={'Product'}
                            onChange={this.handleChangeproduct}
                            options={this.state.products}
                            style={{width: '100%'}}
                          />
															</div>
														</div>  
														<div className="col-3" style={{display: this.state.typeRadio ==false? 'block': 'none'}}>
															<div className="form-group">
																<label>Quantity</label>
																<input type="number" className="form-control" row="5" value={this.state.pqty} name="pqty" onChange={this.onChange} placeholder="1"/>
															</div>
														</div>
														                           
														<div className="col-3" style={{display: this.state.typeRadio ==false? 'block': 'none'}}>
															<div className="form-group">
																<label>Price</label>
																<input type="number" className="form-control" row="5" value={this.state.pprice}  name="pprice" onChange={this.onChange} placeholder="1"/>
															</div>
														</div>
                                                        <div className="col-2" style={{display: this.state.typeRadio ==false? 'block': 'none'}}>
                                                        <button className="btn btn-primary" onClick={()=> this.AddProduct()}>
														<i className="fa fa-plus"></i> Add
													</button>
														</div>
                                                        <div class="table-responsive">
                <table class="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                    <thead class="bg-none bgc-default-tp1">
                        <tr class="text-white">
                        <th>Qty</th>
                            <th>Description</th>
                           
                            <th>Unit Price</th>
                            <th width="140">Amount</th>
                        </tr>
                    </thead>

                    <tbody class="text-95 text-secondary-d3">
                        <tr></tr>
                        {this.state.CartService.map((row) => (
                        <tr key={row.Category}>
                             <td><MdDelete style={{color: '#db3548', fontSize: 20}} onClick={()=>this.deleteItemService(row)} />1</td>
                            <td>{row.Category} {row.Description}</td>
                           
                            <td class="text-95">{this.ccyFormat(parseFloat(row.cost))}</td>
                            <td class="text-secondary-d2">{this.ccyFormat(parseFloat(row.cost))}</td>
                        </tr>  ))}
                        {this.state.CartProduct.map((row) => (  <tr key={row.Category}>
                            <td>{row.pqty==1?<MdDelete style={{color: '#db3548', fontSize: 20}} onClick={()=>this.deleteItem(row)} />: <MdDoDisturbOn style={{color: '#db3548', fontSize: 20}} onClick={()=>this.descrease(row)}/>}{row.pqty}<MdAddBox style={{color: '#2aa153', fontSize: 20}} onClick={()=>this.increase(row)}/></td>
                            <td>{row.Category}  {row.Description}</td>
                           
                            <td class="text-95">{this.ccyFormat(parseFloat(row.pprice))}</td>
                            <td class="text-secondary-d2">{this.ccyFormat(parseFloat(row.pqty)*parseFloat(row.pprice))}</td>
                        </tr>
                                                                ))}
   <tr>
															
                              <td colSpan="3"><label style={{'float': 'right'}}>SubTotal: </label></td>
                              
                              <td class="text-secondary-d2">
                              
                                ₱{this.ccyFormat(parseFloat(this.TotalAmountService())+parseFloat(this.TotalAmountProduct()))}</td>
                          </tr>
                      <tr>
															
                              <td colSpan="3"> 	<label  style={{'float': 'right'}}>Discount</label></td>
                              
                              <td class="text-secondary-d2">
                              <div className="form-group">
                                
                                  <input type="number" className="form-control" row="5" name="Discount" value={this.state.Discount} onChange={this.onChange} placeholder="Discount"/>
                                </div>
                             </td>
                          </tr>
                              <tr>
															
                            <td colSpan="3"><label style={{'float': 'right'}}>TOTAL: </label></td>
                            
                            <td class="text-secondary-d2">
                            
                              ₱{this.ccyFormat(parseFloat(this.TotalAmountService())+parseFloat(this.TotalAmountProduct())-parseFloat(this.state.Discount))}</td>
                        </tr>
                    </tbody>
                </table>
            </div>


    
                                                                  
													</div>
												</div>
												<div className="modal-footer justify-content-between">
													<button onClick={()=>this.setState({modalVisible: false})} className="btn btn-danger" data-dismiss="modal">
														<i className="fa fa-times"></i> Close
													</button>
                                                    <button className="btn btn-danger" onClick={()=>this.resetData()}>
														<BiReset /> Reset
													</button>
													<button className="btn btn-primary" onClick={()=>this.saveInvoice()}>
														<i className="fa fa-check"></i> Save
													</button>
												</div>
											</div>
          </Modal.Body>
          
        </Modal.Content>
      </Modal>
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

		<div className="content-wrapper"  style={{'overflow': 'scroll',   height: window.innerHeight, marginBottom: 50}}>
			<section className="content-header">
				<div className="container-fluid">
					<div className="row mb-2">
						<div className="col-sm-6">
							<h1>Sales Management</h1>
						</div>
						<div className="col-sm-6">
							<ol className="breadcrumb float-sm-right">
								<li className="breadcrumb-item"><a href="#">Management</a></li>
								<li className="breadcrumb-item active">Order</li>
							</ol>
						</div>
					</div>
				</div>
			</section>
			<section className="content" >
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
					<div className="card">
						<div className="card-header">
							<h3 className="card-title">Sales Data table</h3> 
							<button type="button" className="btn btn-success btn-sm" onClick={()=> this.setState({modalVisible: true})} style={{marginLeft: '77%'}}>
								<i className="fa fa-plus">Add</i>
							</button>
							
						</div>
						<div className="card-body" >
            <input type="text" name="search" value={this.state.search} onChange={this.searchInv} class="form-control col-3" style={{'float': 'right'}}placeholder="Search.."/>
								<div className="col-6" style={{flexDirection: 'row'}}>
							<p>Show <select name="noEntries" class="form-control-Entries" onChange={this.onChange}>
  <option value="10">10</option>
  <option value="25">25</option>
  <option value="50">50</option>
  <option value="100">100</option>
</select> entries</p></div>
<div>

	</div>
							<table  className="table table-bordered table-striped">
								<thead>
									<tr>
										<th>Full Name</th>
										<th>Invoice No.</th>
										<th>Services and Products</th>
                    <th>SubTotal</th>
                    <th>Discount</th>
										<th>Total</th>
										<th width="7%"></th>
									</tr>
								</thead>
								<tbody>
                                {this.state.invoiceNo.map((row) => (  
                                <tr>
                                <td>{row.datas.Customer.firstName} {row.datas.Customer.middleName} {row.datas.Customer.lastName}</td>
                                <td>INV-{row.datas.InvoiceNo<10? '000'+row.datas.InvoiceNo:row.datas.InvoiceNo<100? '00'+row.datas.InvoiceNo:row.datas.InvoiceNo<1000? '0'+row.datas.InvoiceNo:row.datas.InvoiceNo}</td>
                                <td>         <table class="table table-striped table-borderless border-0 border-b-2 brc-default-l1">
                                            <thead class="bg-none bgc-default-tp1">
                                                <tr class="text-white">
                                                <th>Qty</th>
                                                    <th>Description</th>
                                                
                                                    <th>Unit Price</th>
                                                    <th width="140">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody class="text-95 text-secondary-d3">
                                                <tr></tr>
                                                {row.datas.Service.map((row,index) => (
                                                <tr key={index}>
                                                    <td>1</td>
                                                    <td>{row.Description}</td>
                                                
                                                    <td class="text-95">{this.ccyFormat(parseFloat(row.cost))}</td>
                                                    <td class="text-secondary-d2">{this.ccyFormat(parseFloat(row.cost))}</td>
                                                </tr>  ))}
                                                {row.datas.Product.map((row) => (
                                                <tr key={row.Category}>
                                                <td>{row.pqty}</td>
                                                <td>{row.Category}</td>
                                               
                                                <td class="text-95">{this.ccyFormat(parseFloat(row.pprice))}</td>
                                                <td class="text-secondary-d2">{this.ccyFormat(parseFloat(row.pqty)*parseFloat(row.pprice))}</td>
                                            </tr>  ))}
                                            </tbody>
                                        </table>
                                </td>
                                    <td>{this.ccyFormat(row.datas.Total)}</td>
                                    <td>{this.ccyFormat(row.datas.Discount)}</td>
                                <td>{this.ccyFormat(row.datas.Total-row.datas.Discount)}</td>
                                <td>
                                    <button className="btn btn-info btn-xs" onClick={()=>this.props.history.push('/invoiceDetails/'+row.datas.id )}>
                                        <i className="fa fa-eye"></i> 
                                    </button>
                                   
                                </td>
                            </tr>
                                                                ))}
									
<tr>
	<td colspan="2">
<div className="col-12 row">
							<p>Showing {this.state.currentPage == 0? '1': this.state.currentPage+1} to {this.state.currentPage + this.state.perPage > this.state.orgtableData.length ? this.state.orgtableData.length:this.state.currentPage + this.state.perPage} of {this.state.orgtableData.length} entries</p></div>
		
</td>
<td colspan="6">
	<div style={{'float': 'right'}}>
<ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    subContainerClassName={"pages pagination"}
                    
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    activeClassName={'active'}
					
/>
</div>
	</td>
</tr>
								</tbody>
							</table>
						</div>
					</div>
				    </div>
                </div>
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


export default sales;
