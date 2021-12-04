import React, { Component } from 'react';
import { Link,withRouter } from 'react-router-dom';
import { FaEnvelope,FaLock, FaUserShield, FaUserCog , FaMobileAlt, FaGlobeAsia, FaHome, FaUserAlt, FaRegAddressCard, FaIdCard} from "react-icons/fa";
import { FcShop, FcLock, FcManager,FcTabletAndroid, FcFeedback, FcGlobe, FcGallery } from "react-icons/fc";
import { GoEyeClosed,GoEye } from "react-icons/go";
import { BiReset,BiEdit } from "react-icons/bi";
import { BsImages } from "react-icons/bs";
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

class addProduct extends Component {
  constructor(props) {
    super(props);
    this.onDataChange = this.onDataChange.bind(this);
    this.GetCategories = this.GetCategories.bind(this)
    this.state = {
    modalVisible:false,
    customers: [],
    EditmodalVisible:false,
    txtFirstName: '',
    txtMiddleName: '',
    txtLastName: '',
    txtAddress: '',
    txtMobile: '',
    txtEmail: '',
    txtPassword: '',
	
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
    products:slice
  })

  }
  onChangeInputFile(event) {
    const upload_files = Array.from(event.target.files);
    this.setState({ upload_files });   
};

  componentDidMount() {
    this.unsubscribe = firebase.firestore().collection("customers").onSnapshot(this.onDataChange);
    this.unsubscribeGetCategories= firebase.firestore().collection("Category").onSnapshot(this.GetCategories);
  }

  GetCategories(items) {
    let categories = [];

    items.forEach((item) => {
      let id = item.id;
      let data = item.data();
      categories.push({label: item.data().label, value: item.data().label,  id: item.data().id});
    });
console.log('categories: ', categories)
    this.setState({categories});
  }

  onDataChange(items) {
    let customers = [];
    items.forEach((item) => {
        customers.push({datas: item.data(),  searchText: item.data().address + ' '+ item.data().email + ' '+item.data().fullName+ ' '+ item.data().mobile+ ' '+ item.data().password});
    });
	var slice = customers.slice(this.state.offset, this.state.offset + this.state.perPage)

    this.setState({ customers:slice ,   pageCount: Math.ceil(customers.length / this.state.perPage), orgtableData : customers,});
  }


 componentWillUnmount() {
     this.unsubscribeGetCategories();
     this.unsubscribe();
  }

  ccyFormat(num) {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
  }
  handleChangeCategory= (selectedCategory) => {
    this.setState({ selectedCategory });
  };

  handleChangeEditcategory= (selectedproducts) => {
    this.setState({ Editcategory:selectedproducts.label  });
  };
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }
  onChange = event => {
	if([event.target.name]=='noEntries'){
		var slice = this.state.orgtableData.slice(this.state.offset, this.state.offset + parseInt(event.target.value))

		this.setState({ customers:slice ,   pageCount: Math.ceil(this.state.orgtableData.length / parseInt(event.target.value)), perPage : parseInt(event.target.value),});
	  }else{
    this.setState({ [event.target.name]: event.target.value });
	  }
};

 
  AddProduct(){
    if(this.state.txtFirstName == ''){
        cogoToast.error('Please enter first name');
        return;
      }
        if(this.state.txtLastName == ''){
          cogoToast.error('Please enter last name');
          return;
        }
        if(this.state.txtMobile == ''){
          cogoToast.error('Please enter mobile number');
          return;
        }
        if(this.state.txtEmail == ''){
          cogoToast.error('Please enter email');
          return;
        }
        if(this.state.txtPassword == ''){
          cogoToast.error('Please enter password');
          return;
        }
    else{
        cogoToast.loading('Saving...').then(() => { 
            firebase.auth().createUserWithEmailAndPassword(this.state.txtEmail, this.state.txtPassword)
            .then(authUser => {
                firebase.firestore().collection("customers").doc(authUser.user.uid).set({
                    address:this.state.txtAddress,
                    email:this.state.txtEmail,
                    firstName:this.state.txtFirstName,
                    fullName:this.state.txtFirstName +' '+ this.state.txtMiddleName+' '+this.state.txtLastName,
                    id:authUser.user.uid,
                    lastName:this.state.txtLastName,
                    middleName:this.state.txtMiddleName,
                    mobile:this.state.txtMobile,
                    password:this.state.txtPassword,
                });
            }).then((sucess)=>{
                cogoToast.success("Customer Saved")
                this.setState({modalVisible: false})
            }).catch(error => {
                    console.log('error: ', error)
                    cogoToast.error('Failed to sign up')
                        }).catch(error => {
                            console.log('error: ', error)
                            cogoToast.error('Failed to sign up')
                                })
                  
                 });
      }
}




  SaveProduct(){
    if(this.state.txtFirstName == ''){
      cogoToast.error('Please enter first name');
      return;
    }
      if(this.state.txtLastName == ''){
        cogoToast.error('Please enter last name');
        return;
      }
      if(this.state.txtMobile == ''){
        cogoToast.error('Please enter mobile number');
        return;
      }
      if(this.state.txtEmail == ''){
        cogoToast.error('Please enter email');
        return;
      }
      if(this.state.txtPassword == ''){
        cogoToast.error('Please enter password');
        return;
      }
    else{
        cogoToast.loading('Saving...').then(() => { 
  firebase.firestore().collection("Product Information").doc(this.state.editID).update({
      id:this.state.editID,
      Category: this.state.Editcategory,
      Code: this.state.Editcode,
      Details: this.state.EdittxtDetails,
      Description: this.state.Editdescription,
      UnitPrice:this.state.EdittxtUnitPrice,
      Quantity:parseFloat(this.state.EdittxtQuantity)
        }).then(() => {
			
			/* Upload images */
			
			this.setState({
                EditmodalVisible:false,
                Editupload_files: [],
                Editcode: '',
                Editcategory: '',
                Editdescription: '',
                EdittxtDetails: '',
                EdittxtQuantity: '',
                EdittxtUnitPrice: '',
                EditselectedCategory :null,
                Editfeatured_image: '',
             
              });
			cogoToast.success("Product Saved");
		})
    });
          ;
      }
}

deleteProduct(item){
    if(window.confirm('Are you sure you want to delete this product?')){
    firebase.firestore().collection('Product Information').doc(item.id).delete()
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

  searchCustomer = event => {
	const newData = this.state.orgtableData.filter(item => {
		const itemData = item.searchText.toUpperCase();
		const textData = event.target.value.toUpperCase();
	   
		return itemData.indexOf(textData) > -1
	  });
	  var slice = newData.slice(this.state.offset, this.state.offset + this.state.perPage)

	  this.setState({ customers:slice });

console.log('newData: ',newData)
/*	if([event.target.name]=='noEntries'){
		}else{
  this.setState({ [event.target.name]: event.target.value });}*/
};

  render() {
 

    return (
      <NativeBaseProvider>
          <Modal
        isOpen={this.state.modalVisible}
        onClose={() =>this.setState({modalVisible: false})}
        size={'xl'}
      >
        <Modal.Content style={{marginBottom: "auto", marginTop: 60}} >
          <Modal.CloseButton />
          <Modal.Header>Add Client</Modal.Header>
          <Modal.Body>
					<div>
						<div class="card-body">
                        <div class="row">
								<div class="col-4">
									<div class="form-group">
										<label>First Name</label>
										<input type="text" name="txtFirstName" class="form-control" onChange={this.onChange} placeholder="Enter First Name.." required/>
									</div>
								</div>
								<div class="col-4">
									<div class="form-group">
										<label>Middle Name</label>
										<input type="text" name="txtMiddleName" class="form-control" onChange={this.onChange} placeholder="Enter Middle Name.." required/>
									</div>
								</div>
								<div class="col-4">
									<div class="form-group">
										<label>Last Name</label>
										<input type="text" name="txtLastName" class="form-control" onChange={this.onChange} placeholder="Enter Last Name.." required/>
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Complete Address</label>
										<input type="text" name="txtAddress" class="form-control" onChange={this.onChange} placeholder="-    Street/Purok      -          City          -       Province     - " required/>
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Mobile Number</label>
										<input type="text" name="txtMobile" class="form-control" onChange={this.onChange} placeholder="Enter Mobile Number .." required/>
									</div>
								</div>  
								<div class="col-6">
									<div class="form-group">
										<label>Email Address</label>
										<input type="text" name="txtEmail" class="form-control" onChange={this.onChange} placeholder="Enter Email Address .." required/>
									</div>
								</div>
								<div class="col-5">
									<div class="form-group">
										<label>Password</label>
										<input type="password" name="txtPassword" class="form-control" onChange={this.onChange} placeholder="Enter Password .." required/>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer justify-content-between">
							<button onClick={()=>this.setState({modalVisible: false})}  class="btn btn-danger" data-dismiss="modal">
								<i class="fa fa-times"></i> Close
							</button>
							<button onClick={()=> this.AddProduct()} class="btn btn-primary">
								<i class="fa fa-check"></i> Save
							</button>
						</div>
					</div>
          </Modal.Body>
          
        </Modal.Content>
      </Modal>





      <Modal
        isOpen={this.state.EditmodalVisible}
        onClose={() =>this.setState({EditmodalVisible: false})}
        size={'xl'}
      >
        <Modal.Content style={{marginBottom: "auto", marginTop: 60}} >
          <Modal.CloseButton />
          <Modal.Header>Update Product</Modal.Header>
          <Modal.Body>
					<div>
						<div class="card-body">
							<div class="row">
								<div class="col-12">
									<div class="form-group">
										<label>Code</label>
										<input type="number" class="form-control" value={this.state.Editcode} placeholder="Enter Code." name="Editcode" onChange={this.onChange} required />
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Category: </label>
                                        <Select
                            value={this.state.selectedCategory}
                            placeholder={this.state.Editcategory}
                            onChange={this.handleChangeEditcategory}
                            options={this.state.categories}
                            style={{width: '100%'}}
                          />
										
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Description</label>
										<input type="text" name="Editdescription" value={this.state.Editdescription} onChange={this.onChange} class="form-control" placeholder="Enter Description.." required/>
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Details</label>
										<input type="text" name="EdittxtDetails" onChange={this.onChange} value={this.state.EdittxtDetails} class="form-control" placeholder="Enter Details .." required/>
									</div>
								</div>  
								<div class="col-6">
									<div class="form-group">
										<label>Quantity</label>
										<input type="number" name="EdittxtQuantity" onChange={this.onChange} value={this.state.EdittxtQuantity} class="form-control" placeholder="Enter Quantity .." required/>
									</div>
								</div>
								<div class="col-6">
									<div class="form-group">
										<label>UnitPrice</label>
										<input type="number" name="EdittxtUnitPrice" onChange={this.onChange} value={this.state.EdittxtUnitPrice} class="form-control" placeholder="Enter UnitPrice .." required/>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer justify-content-between">
							<button class="btn btn-danger" >
								<i class="fa fa-times"></i> Close
							</button>
							<button onClick={()=> this.SaveProduct()} class="btn btn-primary">
								<i class="fa fa-check"></i> Update
							</button>
						</div>
					</div>
          </Modal.Body>
          
        </Modal.Content>
      </Modal>
      <body class="hold-transition sidebar-mini">
	<div class="wrapper">
		<nav class="main-header navbar navbar-expand navbar-light navbar-pink">
			<ul class="navbar-nav">
				<li class="nav-item">
					<a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
				</li>
			</ul>
			<ul class="navbar-nav ml-auto">
				<li class="nav-item">
					<a class="nav-link" data-widget="fullscreen" href="#" role="button">
						<i class="fas fa-expand-arrows-alt"></i>
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
						<i class="fas fa-th-large"></i>
					</a>
				</li>
			</ul>
		</nav>

		<aside class="main-sidebar sidebar-dark-primary elevation-4">
			<a href="" class="brand-link">
				<img src="../dist/img/logo.jpg" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{opacity: 0.8}}/>
				<span class="brand-text font-weight-light">P.A.W.S</span>
			</a>
			<div class="sidebar">
				<div class="user-panel mt-3 pb-3 mb-3 d-flex">
					<div class="image">
						<img src="../dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image"/>
					</div>
					<div class="info">
						<a href="#" class="d-block">STAFF</a>
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

		<div class="content-wrapper">
			<section class="content-header">
				<div class="container-fluid">
					<div class="row mb-2">
						<div class="col-sm-6">
							<h1>Customer Information</h1>
						</div>
						<div class="col-sm-6">
							<ol class="breadcrumb float-sm-right">
								<li class="breadcrumb-item"><a href="#">Management</a></li>
								<li class="breadcrumb-item active">Order</li>
							</ol>
						</div>
					</div>
				</div>
			</section>
			<section class="content" style={{'overflow': 'scroll',   height: window.innerHeight, marginBottom: 50}}>
				<div class="container-fluid">
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header">
									<h3 class="card-title">Customer Information Data table</h3> 
									<button class="btn btn-success btn-sm" style={{marginLeft: '85%'}}  onClick={()=> this.setState({modalVisible: true})}>
										<i class="fa fa-plus">Add</i>
									</button>
								</div>
								<div class="card-body" >
								<input type="text" name="search" value={this.state.search} onChange={this.searchCustomer} class="form-control col-3" style={{'float': 'right'}}placeholder="Search.."/>
								<div className="col-6" style={{flexDirection: 'row'}}>
							<p>Show <select name="noEntries" class="form-control-Entries" onChange={this.onChange}>
  <option value="10">10</option>
  <option value="25">25</option>
  <option value="50">50</option>
  <option value="100">100</option>
</select> entries</p></div>
<div>

	</div>
									<table class="table table-bordered table-striped" style={{marginBottom: 100}}>
										<thead>
											<tr>
												<th>First Name</th>
												<th>Middle Name</th>
												<th>Last Name</th>
												<th>Complete Address</th>
												<th>Mobile Number</th>
												<th>Email Address</th>
												<th>Password</th>
											</tr>
										</thead>
										<tbody>
                                        {this.state.customers.map((row) => (  
                                <tr>
                                <td>{row.datas.firstName}</td>
                                <td>{row.datas.middleName}</td>
                                <td>{row.datas.lastName}</td>
                                <td>{row.datas.address}</td>
                                <td>{row.datas.mobile}</td>
                                <td>{row.datas.email}</td>
                                <td>{row.datas.password}</td>
                              
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
	</div>

	
</body>
      </NativeBaseProvider>
    );
  }
}


export default addProduct;
