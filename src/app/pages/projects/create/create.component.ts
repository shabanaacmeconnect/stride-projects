import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})

/**
 * Projects-create component
 */
export class CreateComponent implements OnInit {
  start: Date;
  end: Date;

  constructor( private route: ActivatedRoute,private calendar: NgbCalendar,
    public formBuilder: FormBuilder,
    private authFackservice: AuthfakeauthenticationService,) { }
  // bread crumb items
  breadCrumbItems: Array<{}>;

  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  selected: any;
  hidden: boolean;
  users=[]
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean=false;
  title="Create New Project"
  @ViewChild('dp', { static: true }) datePicker: any;
  id=''
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Projects', href:'/projects'  }, { label: 'Create New', active: true }];
    this.id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):'';
    if(this.id){
      this.breadCrumbItems = [{ label: 'Projects', href:'/projects' }, { label: 'Edit Project', active: true }];
      this.title="Edit Project";
      this.getDetails();
    }
    this.selected = '';
    this.hidden = true;
    this.initForm();
    this.getUsers();
  }
  initForm(){
    this.typeValidationForm = this.formBuilder.group({
      project_id:0,
      project_name: ['', [Validators.required]],
      project_description:'',
      date:'',
      users:[]
     });
    
  }
  getUsers(){
    this.authFackservice.get('admin/employees').subscribe(
      res => {
        if(res['status']==true){
          this.users=res['data'];
        }
      })
  }
  getDetails(){
    this.authFackservice.get('admin/projectDetails?project_id='+this.id).subscribe(
      res => {
        if(res['status']==true){
          this.typeValidationForm.patchValue({
            project_id:this.id,
            project_name: res['data']['projectData'][0]['project_name'],
            project_description: res['data']['projectData'][0]['project_description'],
            date: res['data']['projectData'][0]['start_time'].replaceAll('-','/') +'-'+ res['data']['projectData'][0]['end_time'].replaceAll('-','/'),
            users: res['data']['projectData'][0]['project_user_ids'].split(',').map(Number),
          });
        }
        this.start= res['data']['projectData'][0]['start_time'].replaceAll('-','/') ;
        this.end= res['data']['projectData'][0]['end_time'].replaceAll('-','/')
    })
  }
 
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();
this.start=this.fromDate;
this.end=this.toDate;
      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    }
  }
  /**
   * Is hovered over date
   * @param date date obj
   */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
   * @param date date obj
   */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
   * @param date date obj
   */
 convertDate(date){
    let d=new Date(date);
        let  month = '' + (d.getMonth() + 1);
        let  day = '' + d.getDate();
        let  year = d.getFullYear();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
          day = '0' + day;
        let value= [year,month,day].join('-');
        return value;
    }
  
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }
  get type() {
    return this.typeValidationForm.controls;
  }
  typeSubmit() {
    this.typesubmit = true;
    if(this.typeValidationForm.status=='INVALID')
    return;
    if(this.typeValidationForm.value.date){
      let d=this.typeValidationForm.value.date.split('/')
      // let start=this.convertDate(d[0])
      // let end=this.convertDate(d[1])
      console.log(this.convertDate(this.start),this.convertDate(this.end))
    }
    var formData: any = new FormData();
    formData.append("project_name", this.typeValidationForm.value.project_name);
    formData.append("project_user_ids", this.typeValidationForm.value.users);
    formData.append("project_description", this.typeValidationForm.value.project_description);
    formData.append("start_time", this.convertDate(this.start));
    formData.append("end_time",this.convertDate(this.end));
   let data=this.typeValidationForm.value;
   if(data.project_id==0 || data.project_id==null){
      this.authFackservice.postMultipart('admin/projects',formData).subscribe(
        res => {
          if(res['status']==true){
            Swal.fire('Success!', 'New project has been added.', 'success');
          }else{
            Swal.fire('Error!', res['message'], 'error');
          }
        });  
    }else{
      formData.append("project_id", this.typeValidationForm.value.project_id);
      this.authFackservice.putMultipart('admin/projects',formData).subscribe(
        res => {
          if(res['status']==true){
            Swal.fire('Success!', 'Selected project has been updated.', 'success');

          }else{
            Swal.fire('Error!', res['message'], 'error');

          }
        }); 
    }
  }
}
