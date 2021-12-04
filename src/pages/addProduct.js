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
import { MdAddPhotoAlternate } from "react-icons/md";
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
    categories:[],
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
    products: [],

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
    Editimages: [],
    editID: '',

    Description: '',
    selectedDescription:null,


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
    this.unsubscribe = firebase.firestore().collection("Product Information").onSnapshot(this.onDataChange);
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
    let products = [];
    items.forEach((item) => {
      products.push({datas: item.data(),  searchText: item.data().Category + ' '+ item.data().Code + ' '+item.data().Description + ' '+item.data().Quantity.toString() + ' '+ item.data().Details+ ' '+ item.data().UnitPrice});
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
	if([event.target.name]=='noEntries'){
		var slice = this.state.orgtableData.slice(this.state.offset, this.state.offset + parseInt(event.target.value))

		this.setState({ products:slice ,   pageCount: Math.ceil(this.state.orgtableData.length / parseInt(event.target.value)), perPage : parseInt(event.target.value),});
	  }else{
    this.setState({ [event.target.name]: event.target.value });}
};
searchProduct = event => {
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
 
  AddProduct(){
    if(this.state.code == ''){
      cogoToast.error('Please enter product code');
      return;
    }
    if(this.state.selectedCategory ==null){
        cogoToast.error('Please select category');
        return;
      }
      if(this.state.txtQuantity == ''){
        cogoToast.error('Please enter product quantity');
        return;
      }
      if(this.state.txtUnitPrice == ''){
        cogoToast.error('Please enter product unit price');
        return;
      }
    else{
        cogoToast.loading('Saving...').then(() => { 
         const newDocumentID =  firebase.firestore().collection('Product Information').doc().id;
  firebase.firestore().collection("Product Information").doc(newDocumentID).set({
      id:newDocumentID,
      Category: this.state.selectedCategory.label,
      Code: this.state.code,
      Details: this.state.txtDetails,
      Description: this.state.Description,
      UnitPrice:this.state.txtUnitPrice,
      Quantity:parseFloat(this.state.txtQuantity),
      images:[],
        }).then(() => {
			
			/* Upload images */
			if(this.state.upload_files.length){
				const storageRef = firebase.storage();
				let counter = 0;
				
				this.state.upload_files.forEach((file, _index, array) => {
					let path = `images/products/${newDocumentID}/${Math.random().toString(36).substring(7)}`;
					storageRef
						.ref(path)
						.put(file).then((snapshot) => {
							snapshot.ref.getDownloadURL().then((url) => {
								let newImage = {'path': path, 'url': url};
								this.state.images.push(newImage); /* Push new image to the images state */
								
								if (counter === array.length -1){
									this.setState({ images: this.state.images, upload_files: [] }); /* Update state to refelct new images in UI */
									firebase.firestore().collection("Product Information").doc(newDocumentID).update({images: this.state.images}); /* Insert update image list into the database */
								}
								
								counter++;
							})
						})
						.catch(error => {
							this.setState({ error });
						});
					
				});
			}
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




  SaveProduct(){
    if(this.state.Editcode == ''){
      cogoToast.error('Please enter product code');
      return;
    }
    if(this.state.Editcategory ==null || this.state.Editcategory ==''){
        cogoToast.error('Please select category');
        return;
      }
     
      if(this.state.EdittxtQuantity == ''){
        cogoToast.error('Please enter product quantity');
        return;
      }
      if(this.state.EdittxtUnitPrice == ''){
        cogoToast.error('Please enter product unit price');
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
			if(this.state.upload_files.length){
				const storageRef = firebase.storage();
				let counter = 0;
				
				this.state.upload_files.forEach((file, _index, array) => {
					let path = `images/products/${this.state.editID}/${Math.random().toString(36).substring(7)}`;
					storageRef
						.ref(path)
						.put(file).then((snapshot) => {
							snapshot.ref.getDownloadURL().then((url) => {
								let newImage = {'path': path, 'url': url};
								this.state.Editimages.push(newImage); /* Push new image to the images state */
								
								if (counter === array.length -1){
									this.setState({ images: this.state.Editimages, upload_files: [] }); /* Update state to refelct new images in UI */
									firebase.firestore().collection("Product Information").doc(this.state.editID).update({images: this.state.Editimages}); /* Insert update image list into the database */
								}
								
								counter++;
							})
						})
						.catch(error => {
							this.setState({ error });
						});
					
				});
			}
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




 onDeleteImage = event => {
    let path = event.target.getAttribute('path');
    const { Editimages,editID} = this.state;
    const self = this;
    
    if(window.confirm('Are you sure you want to delete this image?')){
        let storageRef = firebase.storage();
        let imageRef = storageRef.ref().child(`${path}`);
        let productRef = firebase.firestore().collection("Product Information").doc(editID);
        
        Editimages.forEach((image, index, array) => {
            /* Found image */
            if(image.path === path){
                /* Remove image from array list */
                if(Editimages.splice(index, 1)){
                   
                    
                    /* Delete image in storage */
                    imageRef.delete()
                    
                    /* Save changes in firebase */
                    productRef.update({'images': Editimages}).then(() => {
                        /* Update the images state */
                        self.setState({ Editimages: Editimages });
                    
                        cogoToast.success('Image deleted');
                    });
                }
            }
        });
        
    }
};



logout(){
    firebase.auth().signOut().then(()=> {
      console.log('logout')
      this.props.history.push('/')
    }).catch(()=> {
      console.log('err')
    });
  }


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
          <Modal.Header>Add Product</Modal.Header>
          <Modal.Body>
					<div>
						<div class="card-body">
							<div class="row">
								<div class="col-12">
									<div class="form-group">
										<label>Code</label>
										<input type="number" class="form-control" placeholder="Enter Code." name="code" onChange={this.onChange} required />
									</div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Category</label>
                                        <Select
                            value={this.state.selectedCategory}
                            placeholder={'Select Category'}
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
								<div class="col-6">
									<div class="form-group">
										<label>Quantity</label>
										<input type="number" name="txtQuantity" onChange={this.onChange}  class="form-control" placeholder="Enter Quantity .." required/>
									</div>
								</div>
								<div class="col-6">
									<div class="form-group">
										<label>Unit Price</label>
										<input type="number" name="txtUnitPrice" onChange={this.onChange}  class="form-control" placeholder="Enter Unit Price .." required/>
									</div>
								</div>
								<div class="col-12">
									{/*<div class="form-group">
                                  
										<input type="file" id="txtFile"  onChange={this.onImageChange}/>
										<label for="txtFile" class="btn-2"><i class="fa fa-file-image"></i> Image</label>
                                    </div>*/}
                                    <div className="form-group">
											<label className="btn btn-light">
												<MdAddPhotoAlternate style={{fontSize: 25}} className="material-icons f-15 align-middle font-weight-bold" />Add Images 
												<input id="file" type="file" onChange={this.onChangeInputFile.bind(this)} className="d-none" multiple />
											</label>
											{this.state.upload_files.length > 0 && <span className="text-success ml-2">{this.state.upload_files.length} File(s) selected</span>}
										</div>
								</div>
							</div>
						</div>
						<div class="modal-footer justify-content-between">
							<button onClick={()=>this.setState({modalVisible: false})} class="btn btn-danger" data-dismiss="modal">
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
										<label>Quantity</label>
										<input type="number" name="EdittxtQuantity" onChange={this.onChange} value={this.state.EdittxtQuantity} class="form-control" placeholder="Enter Quantity .." required/>
									</div>
								</div>
								<div class="col-6">
									<div class="form-group">
										<label>Unit Price</label>
										<input type="number" name="EdittxtUnitPrice" onChange={this.onChange} value={this.state.EdittxtUnitPrice} class="form-control" placeholder="Enter Unit Price .." required/>
									</div>
								</div>
								<div class="col-12">
									{/*<div class="form-group">
                                  
										<input type="file" id="txtFile"  onChange={this.onImageChange}/>
										<label for="txtFile" class="btn-2"><i class="fa fa-file-image"></i> Image</label>
                                    </div>*/}
                                    <div className="form-group">
											<label className="btn btn-light">
												<BsImages style={{fontSize: 22}}/> Add Images 
												<input id="file" type="file" onChange={this.onChangeInputFile.bind(this)} className="d-none" multiple />
											</label>
											{this.state.upload_files.length > 0 && <span className="text-success ml-2">{this.state.upload_files.length} File(s) selected</span>}
										</div>

                                        <div className="mb-3">
											{this.state.Editimages.length ? 
												<div className="border p-3">
													<div className="table-responsive">
														<table className="table w-auto">
															<tbody>
															{this.state.Editimages.map(image => (
																<tr key={image.path}>
																	<td><img src={image.url} className="" alt="" height="100" /></td>
																	<td>
																		<span className="material-icons f-15 btn btn-light" onClick={this.onDeleteImage} path={image.path}>Delete</span>
																	</td>
																</tr>
															))}
															</tbody>
														</table>
													</div>
												</div>
												:
												<div className="border p-3 text-danger">No images available</div>
											}
										</div>
								</div>
							</div>
						</div>
						<div class="modal-footer justify-content-between">
							<button onClick={() =>this.setState({EditmodalVisible: false})} class="btn btn-danger" >
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

		<div class="content-wrapper" >
			<section class="content-header">
				<div class="container-fluid">
					<div class="row mb-2">
						<div class="col-sm-6">
							<h1>Product Information</h1>
						</div>
						<div class="col-sm-6">
							<ol class="breadcrumb float-sm-right">
								<li class="breadcrumb-item"><a href="#">Pet</a></li>
								<li class="breadcrumb-item active">Product</li>
							</ol>
						</div>
					</div>
				</div>
			</section>
			<section class="content"   style={{'overflow': 'scroll',   height: window.innerHeight, marginBottom: 50}}>
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
								<input type="text" name="search" value={this.state.search} onChange={this.searchProduct} class="form-control col-3" style={{'float': 'right'}}placeholder="Search.."/>
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
												<th width="12%">Image</th>
												<th>Code</th>
                                                <th>Description</th>
												<th>Category</th>
												<th>Details</th>
												<th>Quantity</th>
												<th>Unit Price</th>
												<th width="7%"></th>
											</tr>
										</thead>
										<tbody>
                                        {this.state.products.map((row) => (  
                                <tr>
                                <td>
                                {row.datas.images.length ? 
												<div className="border p-3">
													<div className="table-responsive">
														<table className="table w-auto">
															<tbody>
															{row.datas.images.map(image => (
																<tr key={image.path}>
																	<td><img src={image.url} className="" alt="" height="100" /></td>
																
																</tr>
															))}
															</tbody>
														</table>
													</div>
												</div>
												:
												<div className="border p-3 text-danger">No images available</div>
											}
                                    
                                    </td>
                                <td>{row.datas.Code}</td>
                                <td>{row.datas.Description}</td>
                                <td>{row.datas.Category}</td>
                                <td>{row.datas.Details}</td>
                                <td>{row.datas.Quantity}</td>
                                <td>{this.ccyFormat(parseFloat(row.datas.UnitPrice))}</td>
                                <td>
                                    <button className="btn btn-info btn-xs" onClick={()=>{this.setState({EditmodalVisible:true,
                                    editID: row.datas.id,
                                        Editcode: row.datas.Code,
                                        Editcategory: row.datas.Category,
                                        selectedDescription:{label: row.datas.Description, value: row.datas.Description},
                                        Editdescription: row.datas.Description,
                                        EdittxtDetails: row.datas.Details,
                                        EdittxtQuantity: row.datas.Quantity,
                                        EdittxtUnitPrice: row.datas.UnitPrice,
                                        Editimages: row.datas.images,})}}>
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


export default addProduct;
