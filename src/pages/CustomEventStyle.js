import React, { Component } from 'react';
import cogoToast from 'cogo-toast';
import moment from "moment";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon  from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import { Modal} from "native-base"

import "react-big-scheduler/lib/css/style.css";
import Scheduler, {
  SchedulerData,
  ViewTypes,
  DemoData,
  DATE_FORMAT
} from "react-big-scheduler";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import Select from 'react-select';
import firebase from "./firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const style = ({ palette }) => ({
 
  textCenter: {
    textAlign: 'left',
  },
  commandButton: {
    backgroundColor: 'white',
  },
});









 class CustomEventStyle extends Component {
    constructor(props) {
        super(props);
        this.GetCustomer = this.GetCustomer.bind(this)
        this.state = {
          scheds: null,
          open: false,
          setShow: false,
          selectedcustomers:null,
          modalVisible:false,
          customers:[],
          appointmentdate:null,
          pets:[],
          selectedPet: null,
          txtDetails:'',
        };
      }
    

      componentDidMount() {
        this.unsubscribe= firebase.firestore().collection("customers").onSnapshot(this.GetCustomer);
      }
      GetCustomer(items) {
        let customers = [];
    
        items.forEach((item) => {
            customers.push({label: item.data().fullName, value: item.data().id,  datas: item.data()});
        });
        this.setState({customers:customers})
    console.log('customers: ', customers)
      }
      componentWillUnmount() {
        this.unsubscribe();
     }
     

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
        }).then(() => {
			
			cogoToast.success("Appointment Saved");
		})
    });
          ;
      }
}


      render() {
        return (<div>

<Modal
        isOpen={this.state.modalVisible}
        onClose={() =>this.setState({modalVisible: false})}
        size={'xl'}
      >
        <Modal.Content style={{marginBottom: "auto", marginTop: 60, zIndex: 3000,  flex: 1 }} >
          <Modal.CloseButton />
          <Modal.Header>Add Appointment</Modal.Header>
          <Modal.Body>
					<div>
						<div class="card-body">
							<div class="row">
								<div class="col-12">
									<div class="form-group">
										<label>Appointment Date</label>
                                        <input type="datetime-local"  min={moment().format('YYYY-MM-DD')}  class="form-control" name="appointmentdate" onChange={(item)=>{this.setState({appointmentdate:moment(item.target.value).unix() });console.log('item: ', moment(item.target.value).format('MMM D YYYY hh:mm a'))}} />	</div>
								</div>
								<div class="col-6">
									<div class="form-group">
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
								<div class="col-6">
									<div class="form-group">
										<label>Pet</label>
                                        <Select
                            value={this.state.selectedPet}
                            placeholder={'Pet'}
                            onChange={(selectedPet)=>this.setState({selectedPet})}
                            options={this.state.pets}
                            style={{width: '100%'}}
                          /></div>
								</div>
								<div class="col-12">
									<div class="form-group">
										<label>Details</label>
										<textarea  type="text" name="txtDetails" onChange={this.onChange} class="form-control" placeholder="Enter Details ..">
                                        </textarea>
									</div>
								</div>  
							
								
							</div>
						</div>
						<div class="modal-footer justify-content-between">
							<button type="button" class="btn btn-danger" data-dismiss="modal">
								<i class="fa fa-times"></i> Close
							</button>
							<button onClick={()=> this.AddAppointment()} class="btn btn-primary">
								<i class="fa fa-check"></i> Save
							</button>
						</div>
					</div>
          </Modal.Body>
          
        </Modal.Content>
      </Modal>

 <button class="btn btn-success btn-sm"  onClick={()=> this.setState({modalVisible: true})} style={{marginLeft: '85%'}} onclick="openProductModal('add')">
										<i class="fa fa-plus">Add</i>
									</button>
<div >

        
        </div>        

          </div>
        );
      }
 }

export default DragDropContext(HTML5Backend)(CustomEventStyle);