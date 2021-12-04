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



class invoiceDetails extends Component {
  constructor(props) {
    super(props);
    this.onDataChange = this.onDataChange.bind(this);
    this.state = {
        InvoiceDetails:[],
  };

  }

  componentDidMount() {
    this.unsubscribe = firebase.firestore().collection("Invoice").where('id', '==', this.props.match.params.invoiceInfo).onSnapshot(this.onDataChange);
  }

  onDataChange(items) {
    items.forEach((item) => {
        console.log('InvoiceDetails: ', item.data())
        this.setState({
            InvoiceDetails:item.data()
                         });
      
    });

    
  }


 componentWillUnmount() {
     this.unsubscribe();
  
  }

  ccyFormat(num) {
    return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
  }
 
  render() {


    return (
      <NativeBaseProvider>
          <div class="page-content container" style={{backgroundColor: 'white'}}>
    <div class="container px-0">
        <div class="row mt-4">
            <div class="col-12 col-lg-10 offset-lg-1">
              

                <hr class="row brc-default-l1 mx-n1 mb-4" />

                <div class="row">
                    <div class="col-sm-6">
                        <div>
                          
                            <span class="text-600 text-110 text-blue align-middle">{this.state.InvoiceDetails.Customer== undefined? '': this.state.InvoiceDetails.Customer.label}</span>
                        </div>
                        <div class="text-grey-m2">
                            <div class="my-1">
                            {this.state.InvoiceDetails.Customer== undefined? '':this.state.InvoiceDetails.Customer.address}
                            </div>
                            
                            <div class="my-1"><i class="fa fa-phone fa-flip-horizontal text-secondary"></i> <b class="text-600"> {this.state.InvoiceDetails.Customer== undefined? '':this.state.InvoiceDetails.Customer.mobile} ({this.state.InvoiceDetails.Customer== undefined? '':this.state.InvoiceDetails.Customer.email})</b></div>
                        </div>
                    </div>

                    <div class="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                        <hr class="d-sm-none" />
                        <div class="text-grey-m2">
                            <div class="mt-1 mb-2 text-secondary-m1 text-600 text-125">
                                Invoice
                            </div>

                            <div class="my-2"><i class="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span class="text-600 text-90">No:</span> INV-{this.state.InvoiceDetails.InvoiceNo<10? '000'+this.state.InvoiceDetails.InvoiceNo:this.state.InvoiceDetails.InvoiceNo<100? '00'+this.state.InvoiceDetails.InvoiceNo:this.state.InvoiceDetails.InvoiceNo<1000? '0'+this.state.InvoiceDetails.InvoiceNo:this.state.InvoiceDetails.InvoiceNo}</div>

                            <div class="my-2"><i class="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span class="text-600 text-90">Issue Date:</span> {moment(this.state.InvoiceDetails.timestamp*1000).format('MMM D YYYY hh:mm a')}</div>
                        </div>
                    </div>
                </div>

                <div class="mt-4" >
                    <div class="row text-600 text-white bgc-default-tp1 py-25">
                    <div class="d-none d-sm-block col-4 col-sm-2">Qty</div>
                        <div class="col-9 col-sm-5">Description</div>
                        <div class="d-none d-sm-block col-sm-2">Unit Price</div>
                        <div class="col-2">Amount</div>
                    </div>

                    <div class="text-95 text-secondary-d3">
                        {this.state.InvoiceDetails.Product == undefined? null: this.state.InvoiceDetails.Product.map((row)=>
                        (
                        <div class="row mb-2 mb-sm-0 py-25">
                            <div class="d-none d-sm-block col-2">{row.pqty}</div>
                            <div class="col-9 col-sm-5">{row.Category} {row.Description}</div>
                            <div class="d-none d-sm-block col-2 text-95">{this.ccyFormat(parseFloat(row.pprice))}</div>
                            <div class="col-2 text-secondary-d2">{this.ccyFormat(parseFloat(row.pqty)*parseFloat(row.pprice))}</div>
                        </div>
                        ))}
                         {this.state.InvoiceDetails.Service == undefined? null: this.state.InvoiceDetails.Service.map((row)=>
                        (
                        <div class="row mb-2 mb-sm-0 py-25">
                            <div class="d-none d-sm-block col-2">1</div>
                            <div class="col-9 col-sm-5"> {row.Description}</div>
                            <div class="d-none d-sm-block col-2 text-95">{this.ccyFormat(parseFloat(row.cost))}</div>
                            <div class="col-2 text-secondary-d2">{this.ccyFormat(parseFloat(row.cost))}</div>
                        </div>
                        ))}
                         
                    </div>

                    <div class="row border-b-2 brc-default-l2"></div>

           
                    <div class="row mt-3">
                        <div class="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0">
                            Extra note such as company or payment information...
                        </div>

                        <div class="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                       
                        <div class="row my-2">
                                <div class="col-7 text-right">
                                    SubTotal
                                </div>
                                <div class="col-5">
                                    <span class="text-120 text-secondary-d1">{this.ccyFormat(parseFloat(this.state.InvoiceDetails.Total))}</span>
                                </div>
                            </div>

                            <div class="row my-2">
                                <div class="col-7 text-right">
                                    Discount
                                </div>
                                <div class="col-5">
                                    <span class="text-110 text-secondary-d1">-{this.ccyFormat(parseFloat(this.state.InvoiceDetails.Discount))}</span>
                                </div>
                            </div>

                            <div class="row my-2 align-items-center bgc-primary-l3 p-2">
                                <div class="col-7 text-right">
                                    Total Amount
                                </div>
                                <div class="col-5">
                                    <span class="text-150 text-success-d3 opacity-2">{this.ccyFormat(parseFloat(this.state.InvoiceDetails.Total)-parseFloat(this.state.InvoiceDetails.Discount))}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div>
                        <button  onClick={()=>this.props.history.push('/sales')} class="btn btn-info btn-bold px-4 float-right mt-3 mt-lg-0">Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
      </NativeBaseProvider>
    );
  }
}


export default invoiceDetails;
