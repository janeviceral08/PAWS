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



class addService extends Component {
  constructor(props) {
    super(props);
    this.onDataChange = this.onDataChange.bind(this);
    this.GetCategories = this.GetCategories.bind(this)
    this.state = {
    modalVisible:false,
    categories:[],
    code: '',
    category: '',
    description: '',
    txtDetails: '',
    txtUnitPrice: '',
    selectedCategory :null,
    products: [],
    selectedDescription :null,
    Description :'',
    EditmodalVisible:false,
    Editupload_files: [],
    Editcode: '',
    Editcategory: '',
    Editdescription: '',
    EdittxtDetails: '',
    EdittxtUnitPrice: '',
    EditselectedCategory :null,
    editID: '',
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
    this.unsubscribe = firebase.firestore().collection("Services").onSnapshot(this.onDataChange);
    this.unsubscribeGetCategories= firebase.firestore().collection("ServiceCategory").onSnapshot(this.GetCategories);

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
    let products = [];
    items.forEach((item) => {
      products.push({datas: item.data(),  searchText: item.data().Category + ' '+ item.data().Code + ' '+item.data().Description+ ' '+ item.data().Details+ ' '+ item.data().ServiceFee.toString()});
    });
    var slice = products.slice(this.state.offset, this.state.offset + this.state.perPage)

    this.setState({ products:slice ,   pageCount: Math.ceil(products.length / this.state.perPage), orgtableData : products,});
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
    this.setState({ [event.target.name]: event.target.value });
};

 
addService(){
    if(this.state.code == ''){
      cogoToast.error('Please enter product code');
      return;
    }
    if(this.state.selectedCategory ==null){
        cogoToast.error('Please select category');
        return;
      }
      if(this.state.txtUnitPrice == ''){
        cogoToast.error('Please enter product unit price');
        return;
      }
    else{
        cogoToast.loading('Saving...').then(() => { 
         const newDocumentID =  firebase.firestore().collection('Services').doc().id;
  firebase.firestore().collection("Services").doc(newDocumentID).set({
      id:newDocumentID,
      Category: this.state.selectedCategory.label,
      Code: this.state.code,
      Details: this.state.txtDetails,
      Description: this.state.Description,
      ServiceFee:parseFloat(this.state.txtUnitPrice),
        }).then(() => {
			
			
			this.setState({
                modalVisible:false,
                upload_files: [],
                code: '',
                category: '',
                description: '',
                txtDetails: '',
                txtQuantity: '',
                txtUnitPrice: '',
                selectedCategory :null,
                featured_image: '',
                images: [],
              });
			cogoToast.success("Product Saved");
		})
    });
          ;
      }
}





  SaveService(){
    if(this.state.Editcode == ''){
      cogoToast.error('Please enter product code');
      return;
    }
    if(this.state.Editcategory ==null || this.state.Editcategory ==''){
        cogoToast.error('Please select category');
        return;
      }
      if(this.state.EdittxtUnitPrice == ''){
        cogoToast.error('Please enter product unit price');
        return;
      }
     
    else{
        cogoToast.loading('Saving...').then(() => { 
  firebase.firestore().collection("Services").doc(this.state.editID).update({
      id:this.state.editID,
      Category: this.state.Editcategory,
      Code: this.state.Editcode,
      Details: this.state.EdittxtDetails,
      Description: this.state.Editdescription,
      ServiceFee:parseFloat(this.state.EdittxtUnitPrice),
        }).then(() => {
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
			cogoToast.success("Service Saved");
		})
    });
          ;
      }
}

deleteProduct(item){
    if(window.confirm('Are you sure you want to delete this service?')){
    firebase.firestore().collection('Services').doc(item.id).delete()
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

searchService = event => {
	const newData = this.state.orgtableData.filter(item => {
		const itemData = item.searchText.toUpperCase();
		const textData = event.target.value.toUpperCase();
	   
		return itemData.indexOf(textData) > -1
	  });
	  var slice = newData.slice(this.state.offset, this.state.offset + this.state.perPage)

	  this.setState({ products:slice });

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
          <Modal.Header>Add Service</Modal.Header>
          <Modal.Body>
					<div>
						<div class="card-body">
							<div class="row">
								<div class="col-4">
									<div class="form-group">
										<label>Code</label>
										<input type="number" class="form-control" placeholder="Enter Code." name="code" onChange={this.onChange} required />
									</div>
								</div>
								<div class="col-8">
									<div class="form-group">
										<label>Category</label>
                                        <Select
                            value={this.state.selectedCategory}
                            placeholder={'Category'}
                            onChange={this.handleChangeCategory}
                            options={this.state.categories}
                            style={{width: '100%'}}
                          />
										
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Description</label>
                    <input type="text" name="Description" onChange={this.onChange} class="form-control" placeholder="Enter Description .." required/>
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Details</label>
										<input type="text" name="txtDetails" onChange={this.onChange} class="form-control" placeholder="Enter Details .." required/>
									</div>
								</div>  
								<div class="col-12">
									<div class="form-group">
										<label>Service Fee</label>
										<input type="number" name="txtUnitPrice" onChange={this.onChange}  class="form-control" placeholder="Enter Service Fee .." required/>
									</div>
								</div>
								
							</div>
						</div>
						<div class="modal-footer justify-content-between">
							<button onClick={()=>this.setState({modalVisible: false})}  class="btn btn-danger" data-dismiss="modal">
								<i class="fa fa-times"></i> Close
							</button>
							<button onClick={()=> this.addService()} class="btn btn-primary">
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
          <Modal.Header>Update Service</Modal.Header>
          <Modal.Body>
					<div>
						<div class="card-body">
							<div class="row">
								<div class="col-4">
									<div class="form-group">
										<label>Code</label>
										<input type="number" class="form-control" value={this.state.Editcode} placeholder="Enter Code." name="Editcode" onChange={this.onChange} required />
									</div>
								</div>
								<div class="col-8">
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
                    <input type="text" name="Editdescription" onChange={this.onChange} value={this.state.Editdescription} class="form-control" placeholder="Enter Description .." required/>
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
										<label>Service Fee</label>
										<input type="number" name="EdittxtUnitPrice" onChange={this.onChange} value={this.state.EdittxtUnitPrice} class="form-control" placeholder="Enter Service Fee .." required/>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer justify-content-between">
							<button onClick={()=>this.setState({EditmodalVisible: false})}  class="btn btn-danger" >
								<i class="fa fa-times"></i> Close
							</button>
							<button onClick={()=> this.SaveService()} class="btn btn-primary">
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
				<img src="../dist/img/logo.jpg" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{opacity: 0.8}} />
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
							<h1>Services Information</h1>
						</div>
						<div class="col-sm-6">
							<ol class="breadcrumb float-sm-right">
								<li class="breadcrumb-item active">Services</li>
							</ol>
						</div>
					</div>
				</div>
			</section>
			<section class="content"  style={{'overflow': 'scroll',   height: window.innerHeight, marginBottom: 50}}>
				<div class="container-fluid">
					<div class="row">
						<div class="col-12">
							<div class="card">
								<div class="card-header">
									<h3 class="card-title">Product Information Data table</h3> 
									<button class="btn btn-success btn-sm"  onClick={()=> this.setState({modalVisible: true})} style={{marginLeft: '85%'}} onclick="openProductModal('add')">
										<i class="fa fa-plus">Add</i>
									</button>
								</div>
								<div class="card-body">
                <input type="text" name="search" value={this.state.search} onChange={this.searchService} class="form-control col-3" style={{'float': 'right'}}placeholder="Search.."/>
								<div className="col-6" style={{flexDirection: 'row'}}>
							<p>Show <select name="noEntries" class="form-control-Entries" onChange={this.onChange}>
  <option value="10">10</option>
  <option value="25">25</option>
  <option value="50">50</option>
  <option value="100">100</option>
</select> entries</p></div>
<div>

	</div>
									<table style={{marginBottom: 100}} class="table table-bordered table-striped">
										<thead>
											<tr>
												<th>Code</th>
												<th>Category</th>
												<th>Description</th>
												<th>Details</th>
												<th>Service Fee</th>
												<th width="7%"></th>
											</tr>
										</thead>
										<tbody>
                                        {this.state.products.map((row) => (  
                                <tr>
                                <td>{row.datas.Code}</td>
                                <td>{row.datas.Category}</td>
                                <td>{row.datas.Description}</td>
                                <td>{row.datas.Details}</td>
                                <td>{this.ccyFormat(parseFloat(row.datas.ServiceFee))}</td>
                                <td>
                                    <button className="btn btn-info btn-xs" onClick={()=>{this.setState({EditmodalVisible:true,
                                    editID: row.datas.id,
                                        Editcode: row.datas.Code,
                                        Editcategory: row.datas.Category,
                                        selectedDescription: {label:row.datas.Description, value: row.datas.Description },
                                        Editdescription: row.datas.Description,
                                        EdittxtDetails: row.datas.Details,
                                        EdittxtUnitPrice: row.datas.ServiceFee,})}}>
                                    <BiEdit style={{ fontSize: 22}} />
                                    </button>
                                    <button className="btn btn-danger btn-xs" onClick={()=>this.deleteProduct(row.datas)}>
                                        <MdDelete style={{ fontSize: 22}} />
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
	</div>
	<div class="modal fade" id="productModal">
		<div class="modal-dialog modal-lg">
			
		</div>
	</div>
</body>
      </NativeBaseProvider>
    );
  }
}


export default addService;
