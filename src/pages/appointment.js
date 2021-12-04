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
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "@fullcalendar/core/main.css";



const events = [{ title: "today's event", date: new Date(2021, 11, 24, 10, 33) ,
end:  new Date(2021, 11, 24)}];


class appointment extends Component {
  constructor(props) {
    super(props);
	this.GetCustomer = this.GetCustomer.bind(this)
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
    service: [],
    appointment:[],
	selectedcustomers:null,
          customers:[],
          appointmentdate:moment().add(1,'day'),
          pets:[],
          selectedPet: null,


    EditmodalVisible:false,
  };

  }

  onChangeInputFile(event) {
    const upload_files = Array.from(event.target.files);
    this.setState({ upload_files });   
};


	  GetCustomer(items) {
        let customers = [];
    
        items.forEach((item) => {
            customers.push({label: item.data().fullName, value: item.data().id,  datas: item.data()});
        });
        this.setState({customers:customers})
    console.log('customers: ', customers)
      }


  componentDidMount() {
    this.unsubscribe = firebase.firestore().collection("Services").onSnapshot(this.onDataChange);
    this.unsubscribeGetCategories= firebase.firestore().collection("Appointment").where('status', '==', 'pending').onSnapshot(this.GetCategories);
	firebase.firestore().collection("customers").onSnapshot(this.GetCustomer);
  }

  GetCategories(items) {
    let appointment = [];

    items.forEach((item) => {
	
      appointment.push({title:item.data().Owner,date: new Date(item.data().appointmentdate * 1000),end:new Date(item.data().endon * 1000),  appointmentdate:item.data().appointmentdate, Owner:item.data().Owner,OwnerID:item.data().OwnerID,Pet:item.data().Pet,PetId:item.data().PetId,Details:item.data().Details,AppointMentID:item.data().id, color: "#f44336",});
    });
console.log('categories: ', appointment)
    this.setState({appointment});
  }

  onDataChange(items) {
    let service = [];
    items.forEach((item) => {
        service.push({id: item.data().id,name: item.data().Category,title: item.data().Category });
    });
    this.setState({ service});
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

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
};

handleChangecustomers= (selectedcustomers) => {
    this.setState({ selectedcustomers });
    console.log('selectedcustomers: ', selectedcustomers)
    firebase.firestore().collection("Pet").where('OwnerID', '==',selectedcustomers.value ).onSnapshot((querySnapshot) => {
        let pets = [];
        querySnapshot.forEach((doc) => {
    console.log('doc.data(): ', doc.data())
    pets.push({label: doc.data().name, value: doc.data().id,});
        })
        this.setState({pets});
      })
  };




  
AddAppointment(){
    if(this.state.selectedcustomers ==null){
        cogoToast.error('Please select owner');
        return;
      }
      if(this.state.selectedPet == null){
        cogoToast.error('Please select pet');
        return;
      }
      if(this.state.appointmentdate == null){
        cogoToast.error('Please enter appointment date');
        return;
      }
     
    else{
        cogoToast.loading('Saving...').then(() => { 
         const newDocumentID =  firebase.firestore().collection('Appointment').doc().id;
  firebase.firestore().collection("Appointment").doc(newDocumentID).set({
      id:newDocumentID,
      appointmentdate: this.state.appointmentdate,
      endon:  moment(this.state.appointmentdate*1000).add(30, 'minutes').unix(),
      Details: this.state.txtDetails,
      Owner:this.state.selectedcustomers.label,
      OwnerID:this.state.selectedcustomers.value,
      ownerInformation: this.state.selectedcustomers.datas,
	  Pet: this.state.selectedPet.label,
	  PetId:this.state.selectedPet.value,
	  status:'pending',
        }).then(() => {
			cogoToast.success("Appointment Saved");
			this.setState({ modalVisible:false,
				categories:[],
				code: '',
				category: '',
				description: '',
				txtDetails: '',
				txtUnitPrice: '',
				selectedCategory :null,
				EditmodalVisible:false,})
			
		}).catch(()=>{cogoToast.error("Saving Failed. Try again");
		this.setState({ modalVisible:false,
			categories:[],
			code: '',
			category: '',
			description: '',
			txtDetails: '',
			txtUnitPrice: '',
			selectedCategory :null,
			EditmodalVisible:false,})})
    });
          ;
      }
}


UpdateAppointment(){
  const dataValue={
	appointmentdate: this.state.Editappointmentdate,
	endon:  moment(this.state.Editappointmentdate*1000).add(30, 'minutes').unix(),
	Details: this.state.EditDetails,
	Owner:this.state.selectedcustomers.label,
	OwnerID:this.state.selectedcustomers.value,
	Pet: this.state.selectedPet.label,
	PetId:this.state.selectedPet.value,
	  }
	  console.log('dataValue: ', dataValue)
      if(this.state.selectedcustomers.value == this.state.EditOwnerID){
		firebase.firestore().collection("Appointment").doc(this.state.AppointMentID).update({
			appointmentdate: this.state.Editappointmentdate,
			endon:  moment(this.state.Editappointmentdate*1000).add(30, 'minutes').unix(),
			Details: this.state.EditDetails,
			Owner:this.state.selectedcustomers.label,
			OwnerID:this.state.selectedcustomers.value,
			Pet: this.state.selectedPet.label,
			PetId:this.state.selectedPet.value,
			  }).then(() => {
				  cogoToast.success("Appointment Saved");
				  this.setState({ modalVisible:false,
					  categories:[],
					  code: '',
					  category: '',
					  description: '',
					  txtDetails: '',
					  txtUnitPrice: '',
					  selectedCategory :null,
					  EditmodalVisible:false,})
				  
			  }).catch(()=>{cogoToast.error("Saving Failed. Try again");
			  this.setState({ modalVisible:false,
				  categories:[],
				  code: '',
				  category: '',
				  description: '',
				  txtDetails: '',
				  txtUnitPrice: '',
				  selectedCategory :null,
				  EditmodalVisible:false,})})
        return;
      }
     
    else{
        cogoToast.loading('Saving...').then(() => { 
  firebase.firestore().collection("Appointment").doc(this.state.AppointMentID).update({
      appointmentdate: this.state.Editappointmentdate,
      endon:  moment(this.state.Editappointmentdate*1000).add(30, 'minutes').unix(),
      Details: this.state.EditDetails,
      Owner:this.state.selectedcustomers.label,
      OwnerID:this.state.selectedcustomers.value,
      ownerInformation: this.state.selectedcustomers.datas,
	  Pet: this.state.selectedPet.label,
	  PetId:this.state.selectedPet.value,
        }).then(() => {
			cogoToast.success("Appointment Saved");
			this.setState({ modalVisible:false,
				categories:[],
				code: '',
				category: '',
				description: '',
				txtDetails: '',
				txtUnitPrice: '',
				selectedCategory :null,
				EditmodalVisible:false,})
			
		})
    });
          ;
      }
}



cancelAppointment(){
	if(window.confirm('Are you sure you want to cancel this appointment?')){
		  cogoToast.loading('Saving...').then(() => { 
	firebase.firestore().collection("Appointment").doc(this.state.AppointMentID).update({
		status:'cancelled',
		  }).then(() => {
			  cogoToast.success("Appointment Saved");
			  this.setState({ modalVisible:false,
				  categories:[],
				  code: '',
				  category: '',
				  description: '',
				  txtDetails: '',
				  txtUnitPrice: '',
				  selectedCategory :null,
				  EditmodalVisible:false,})
			  
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
  

  render() {
 

    return (
      <NativeBaseProvider>
        
<Modal
        isOpen={this.state.modalVisible}
        onClose={() =>this.setState({modalVisible: false})}
        size={'xl'}
      >
        <Modal.Content  style={{marginBottom: "auto", marginTop: 60}}>
          <Modal.CloseButton />
          <Modal.Header>Add Appointment</Modal.Header>
          <Modal.Body>
					<div>
						<div className="card-body">
							<div className="row">
								<div className="col-12">
									<div className="form-group">
										<label>Appointment Date</label>
                                        <input type="datetime-local"  min={moment().format('YYYY-MM-DD')} value={moment(this.state.Editappointmentdate).format("YYYY-MM-DDTHH:mm:ss")} className="form-control" name="appointmentdate" onChange={(item)=>{this.setState({appointmentdate:moment(item.target.value).unix() });console.log('item: ', moment(item.target.value).format('MMM D YYYY hh:mm a'))}} />	</div>
								</div>
								<div className="col-6">
									<div className="form-group">
										<label>Customer</label>
                                        <Select
                            value={this.state.selectedcustomers}
                            placeholder={'Customer Name'}
                            onChange={this.handleChangecustomers}
                            options={this.state.customers}
                            style={{width: '100%'}}
                          />
										
									</div>
								</div>
								<div className="col-6">
									<div className="form-group">
										<label>Pet</label>
                                        <Select
                            value={this.state.selectedPet}
                            placeholder={'Pet'}
                            onChange={(selectedPet)=>this.setState({selectedPet})}
                            options={this.state.pets}
                            style={{width: '100%'}}
                          /></div>
								</div>
								<div className="col-12">
									<div className="form-group">
										<label>Details</label>
										<textarea  type="text" name="txtDetails" onChange={this.onChange} className="form-control" placeholder="Enter Details ..">
                                        </textarea>
									</div>
								</div>  
							
								
							</div>
						</div>
						<div className="modal-footer justify-content-between">
							<button onClick={()=>this.setState({modalVisible: false})}  className="btn btn-danger" data-dismiss="modal">
								<i className="fa fa-times"></i> Close
							</button>
							<button onClick={()=> this.AddAppointment()} className="btn btn-primary">
								<i className="fa fa-check"></i> Save
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
          <Modal.Header>Update Appointment</Modal.Header>
          <Modal.Body>
		  <div>
						<div className="card-body">
							<div className="row">
								<div className="col-12">
									<div className="form-group">
										<label>Appointment Date</label>
                                        <input type="datetime-local"  value={moment(this.state.Editappointmentdate*1000).format("YYYY-MM-DDTHH:mm:ss")}  className="form-control" name="Editappointmentdate" onChange={(item)=>this.setState({Editappointmentdate:moment(item.target.value).unix() })} />	</div>
								</div>
								<div className="col-6">
									<div className="form-group">
										<label>Customer</label>
                                        <Select
                            value={this.state.selectedcustomers}
                            placeholder={'Customer Name'}
                            onChange={this.handleChangecustomers}
                            options={this.state.customers}
                            style={{width: '100%'}}
                          />
										
									</div>
								</div>
								<div className="col-6">
									<div className="form-group">
										<label>Pet</label>
                                        <Select
                            value={this.state.selectedPet}
                            placeholder={'Pet'}
                            onChange={(selectedPet)=>this.setState({selectedPet})}
                            options={this.state.pets}
                            style={{width: '100%'}}
                          /></div>
								</div>
								<div className="col-12">
									<div className="form-group">
										<label>Details</label>
										<textarea  type="text" name="EditDetails" value={this.state.EditDetails} onChange={this.onChange} className="form-control" placeholder="Enter Details ..">
                                        </textarea>
									</div>
								</div>  
							
								
							</div>
						</div>
						<div className="modal-footer justify-content-between">
							<button onClick={()=> this.cancelAppointment()} className="btn btn-danger" data-dismiss="modal">
								<i className="fa fa-times"></i> Cancel Appointment
							</button>
							<button onClick={()=> this.UpdateAppointment()} className="btn btn-primary">
								<i className="fa fa-check"></i> Update
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
				<img src="../dist/img/logo.jpg" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: 0.8}} />
				<span className="brand-text font-weight-light">P.A.W.S</span>
			</a>
			<div className="sidebar">
				<div className="user-panel mt-3 pb-3 mb-3 d-flex">
					<div className="image">
						<img src="../dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
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
							<h1>Appointment Schedule</h1>
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
			<section className="content"   style={{'overflow': 'scroll',   height: window.innerHeight, marginBottom: 100}}>
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="card-header">
									<h3 className="card-title">Appointment Schedule</h3> 
									<button className="btn btn-success btn-sm"  onClick={()=> this.setState({modalVisible: true})} style={{marginLeft: '85%'}} onclick="openProductModal('add')">
										<i className="fa fa-plus">Add</i>
									</button>
								</div>
								<div className="card-body" style={{display: this.state.modalVisible == false && this.state.EditmodalVisible ==false ? 'block':'none', marginBottom: 200}}>
								<FullCalendar
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin]}
        events={this.state.appointment}
		eventContent={this.renderEventContent}
		editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
			eventClick={this.handleEventClick}
			select={this.handleDateSelect}
      />
                               

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

  handleDateSelect = (selectInfo) => {
	  this.setState({modalVisible: true , appointmentdate:  selectInfo.startStr})
    
  }
  handleEventClick = (clickInfo) => {

	this.setState({EditmodalVisible: true,
		Editappointmentdate:clickInfo.event.extendedProps.appointmentdate,
		Editselectedcustomers:clickInfo.event.extendedProps.Owner,
		EditOwnerID:clickInfo.event.extendedProps.OwnerID,
		EditPet:clickInfo.event.extendedProps.Pet,
		EditPetId:clickInfo.event.extendedProps.PetId,
		EditDetails:clickInfo.event.extendedProps.Details,
		AppointMentID:clickInfo.event.extendedProps.AppointMentID,
		selectedcustomers:{label: clickInfo.event.extendedProps.Owner, value:clickInfo.event.extendedProps.OwnerID },
		selectedPet:{label: clickInfo.event.extendedProps.Pet, value: clickInfo.event.extendedProps.PetId}
	})
console.log('clickInfo.event: ', clickInfo.event.extendedProps.AppointMentID)
    /*if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }*/
  }


}


export default appointment;
