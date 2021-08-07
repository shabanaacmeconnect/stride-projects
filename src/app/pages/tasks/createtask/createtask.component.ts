import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrls: ['./createtask.component.scss']
})

/**
 * Tasks-create component
 */
export class CreatetaskComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  public Editor = ClassicEditor;
  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean=false;
  title="Create New Task"
  @ViewChild('dp', { static: true }) datePicker: any;
  id='';
  pro_id=''
  types:any=[];
  constructor(private route: ActivatedRoute,public formBuilder: FormBuilder,
    private authFackservice: AuthfakeauthenticationService,private calendar: NgbCalendar) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("task_id")?this.route.snapshot.paramMap.get("task_id"):'';
    this.pro_id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):'';
    
    this.breadCrumbItems = [{ label: 'Projects' , href:'/projects' }, { label: 'Project Details', href:'/projects/view/'+this.pro_id  },{label:'Craete Task', active:true}];
    if(this.id){
      this.breadCrumbItems = [{ label: 'Projects' , href:'/projects' }, { label: 'Project Details', href:'/projects/view/'+this.pro_id   },{label:'Edit Task', active:true}];
      this.title="Edit Task";
      this.getDetails();
    }
    this.initForm();
    this.getTypes()
  }
  initForm(){
    this.typeValidationForm = this.formBuilder.group({
      task_id:0,
      task_name: ['', [Validators.required]],
      task_description:'',
      date:'',
      type_id:['', [Validators.required]],

     });
    
  }

  getDetails(){
    this.authFackservice.get('admin/taskDetails?task_id='+this.id).subscribe(
      res => {
        if(res['status']==true){
          this.typeValidationForm.patchValue({
            task_id:this.id,
            task_name: res['data']['taskData'][0]['task_name'],
            task_description: res['data']['taskData'][0]['task_description'],
            date: res['data']['taskData'][0]['end_date'],
            type_id: res['data']['taskData'][0]['type_id'],
          });
        }
    })
  }
  get type() {
    return this.typeValidationForm.controls;
  }
  getTypes(){
    this.authFackservice.get('admin/taskTypes').subscribe(
      res => {
        if(res['status']==true){
          this.types=res['data'];
        }
      })
  }
  dateformating(d){
    console.log(d,d.month.toString().length)
    if(d.month){
     if (d.month.toString().length < 2) 
   d.month = '0' + d.month;
   if (d.day.toString().length < 2) 
     d.day = '0' + d.day;
   let dateform= [d.year, d.month, d.day].join('-');
   return dateform;
    }else{
      return d;
    }
  }
  typeSubmit() {
    this.typesubmit = true;
    if(this.typeValidationForm.status=='INVALID')
    return;
    var formData: any = new FormData();
    if(this.typeValidationForm.value.date){
      let d=this.dateformating(this.typeValidationForm.value.date)
      formData.append("end_date", d);
      // let end=this.convertDate(d[1])
    }
    formData.append("task_name", this.typeValidationForm.value.task_name);
    formData.append("type_id", this.typeValidationForm.value.type_id);
    formData.append("project_id", Number(this.id));
    formData.append("task_description", this.typeValidationForm.value.task_description);
    // formData.append("end_time",this.convertDate(this.end));
   let data=this.typeValidationForm.value;
   if(data.task_id==0 || data.task_id==null){
      this.authFackservice.postMultipart('admin/tasks',formData).subscribe(
        res => {
          if(res['status']==true){
            Swal.fire('Success!', 'New task has been added.', 'success');
          }else{
            Swal.fire('Error!', res['message'], 'error');
          }
        });  
    }else{
      formData.append("task_id", this.typeValidationForm.value.task_id);
      this.authFackservice.putMultipart('admin/tasks',formData).subscribe(
        res => {
          if(res['status']==true){
            Swal.fire('Success!', 'Selected task has been updated.', 'success');

          }else{
            Swal.fire('Error!', res['message'], 'error');

          }
        }); 
    }
  }
}
