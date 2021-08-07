import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-task-comments',
  templateUrl: './details.component.html',
})

/**
 * Ecomerce merchants component
 */
export class DetailsComponent implements OnInit {
  formData: FormGroup;
  chatSubmit: boolean;
  breadCrumbItems: Array<{}>;
  chatData:[];
  chatMessagesData: [];
  @ViewChild('scroll') scrollRef: PerfectScrollbarComponent;
  @Input() task_id:any;
  @Input() comments:any;
  imageType=true; 
  sizeError=false;
    logo: any;
  constructor( private route:ActivatedRoute, private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }
 ngOnInit(){
 
  this.breadCrumbItems =[];
  this.formData = this.formBuilder.group({
    message: ['', [Validators.required]],
  });
  
  this._fetchData();

 }
 get form() {
  return this.formData.controls;
}

private _fetchData() {
  this.authFackservice.get('admin/taskComments?task_id='+this.task_id).subscribe(
    res => {
      if(res['status']==true){
        this.chatMessagesData =res['data'];
        this.scrollRef.directiveRef.scrollToBottom(); 
      }
    });
  // this.chatData = []
//  this.chatMessagesData = []
}
chatUsername(name) {
  // this.username = name;
  // this.usermessage = 'Hello';
  this.chatMessagesData = [];
  const currentDate = new Date();

  // this.chatMessagesData.push({
  //   name: this.username,
  //   message: this.usermessage,
  //   time: currentDate.getHours() + ':' + currentDate.getMinutes()
  // });
}
selectFile(){
  document.getElementById('file').click();
  }
/**
 * Save the message in chat
 */
 onFileSelected(event) {
   console.log(event.target.files[0].type)
  if(event.target.files[0].type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'||event.target.files[0].type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'||event.target.files[0].type=='application/pdf'|| event.target.files[0].type=='image/png' || event.target.files[0].type=='image/jpg' || event.target.files[0].type=='image/jpeg'){
     this.imageType=true;
    }else{
     this.imageType=false;
     Swal.fire('Error!', 'Invalid File ', 'error');
     return;
  }if( event.target.files[0].size>2000000){
    this.sizeError=true;
    Swal.fire('Error!', 'File size cannot exceed 2 MB', 'error');
    return;
  }else{
    this.sizeError=false;
  }
 this.logo=event.target.files[0];
this.messageSave(2); 
  }
messageSave(type=null) {
  const message = this.formData.get('message').value;
  const currentDate = new Date();
  if ( !this.formData.valid && message=='' &&type!=2 )
    return ;
  
    var formData: any = new FormData();
    formData.append("task_id", this.task_id);
    if(type){
      formData.append("type", type);
      formData.append("comment", 'a');
      formData.append("attachment_path",this.logo)
    }
    else{
      formData.append("comment", this.formData.value.message);
      formData.append("type", 1);
    }

    this.authFackservice.postMultipart('admin/taskComments',formData).subscribe(
      res => {
        if(res['status']==true){
          this._fetchData();
        }
      })
    
    this.formData = this.formBuilder.group({
      message: null
    });

  this.chatSubmit = true;
}
getType(mime){
  if(mime=='image/png' || mime=='image/jpg'|| mime=='image/jpeg')
  return true;
  else return false;
}
}
