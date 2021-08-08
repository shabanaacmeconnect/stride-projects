import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import Swal from 'sweetalert2';
export type SortDirection = 'asc' | 'desc' | '';
export const compare = (v1:number|string, v2:number|string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
export interface SortEvent {
  column: string|null;
  direction: SortDirection;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})

/**
 * Ecomerce merchants component
 */
export class UserComponent implements OnInit {

  page={totalElements:0,pageNumber:1,size:10};
  breadCrumbItems: Array<{}>;
  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean=false;
  merchantsData:any=[];
 
  title='Add';
  closed=true;
  keyword: string='';
  loading=false
  constructor( private router: Router,private modalService: NgbModal,
    private authFackservice: AuthfakeauthenticationService,public formBuilder: FormBuilder) { }
  ngOnInit() {
    this.breadCrumbItems = [{label:"Projects",href:"/projects"},{ label: 'User Management', active: true }];
    this.initForm();
    this._fetchData();
  }
  initForm(){
    this.typeValidationForm = this.formBuilder.group({
      user_id:0,
      name: ['', [Validators.required]],
      mobile:['',[Validators.required,Validators.pattern('[0-9]{9,10}')]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [this.conditionalrequiredValidator(this.title), Validators.minLength(10),Validators.pattern('^(?=(.*[a-zA-Z]){1,})(?=(.*[!@#$%^&*()_+|~=\`<{}:;’>?,./\"]){1,})(?=(.*[0-9]){1,}).{1,}$')]],
      confirmpwd: ['',this.conditionalrequiredValidator(this.title)],
    }, {
        validator: this.MustMatch('password', 'confirmpwd'),
      });
    
  }
  conditionalrequiredValidator(client){      //factory function
    return (control: AbstractControl):{[key: string]: boolean} | null => {
      return (client=="Add"  && (control.value=="" || control.value==null))?{required:true}:null;
    };
  }
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
  }
  search(){
    this.page.pageNumber=1;
    this._fetchData()
  }
  public _fetchData() {
    let url='admin/employees?page='+this.page.pageNumber+'&perPage=10&keyword='+this.keyword
   
    this.authFackservice.get(url).subscribe(
      res => {
        if(res['status']==true){
          this.merchantsData.push(...res['data']);
          this.page.totalElements=res['elementCount']
        }
      });
  }
 
  get type() {
    return this.typeValidationForm.controls;
  }
  largeModal(largeDataModal: any) {
    this.title='Add';
    this.typesubmit=false;
    this.typeValidationForm.reset();
    this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
  }
  editModal(largeDataModal: any,item) {
    this.typesubmit=false;
    this.title='Edit';
    this.initForm();
    this.typeValidationForm.patchValue({
      name: item.name,
      // contact_name:item.contact_name,
      mobile:item.mobile,
      email:item.email,
      user_id:item.user_id
    });
    this.modalService.open(largeDataModal, { size: 'lg',windowClass:'modal-holder', centered: true });
  }
  onScrollingFinished(){
    this.page.pageNumber+=1;
    if(this.page.totalElements/10>= this.page.pageNumber){
      this._fetchData()
      this.loading=true
    }else{
      this.loading=false
    }
  }
  toggleFunction(event,id){
    let currentTarget=event==true?0:1;
    this.authFackservice.put('admin/employees/status?value='+currentTarget+'&user_id='+id,{}).subscribe(
      res => {
        if(res['status']==true){
          if(currentTarget==0)
          Swal.fire('Enabled!', 'selected user has been enabled.', 'success');
          else
           Swal.fire('Disabled!', 'selected user has been disabled.', 'success');
        
          this._fetchData();
        }
      });  
  
  }
  deleteRow(item){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.authFackservice.delete('admin/employees?user_id='+item.user_id).subscribe(
          res => {
            if(res['status']==true){
              Swal.fire('Deleted!', 'selected user has been deleted.', 'success');
              this._fetchData();
            }
          });  
      }
    });
  }
 
  typeSubmit() {
    this.typesubmit = true;
    if(this.typeValidationForm.status=='INVALID')
    return;
    var formData: any = new FormData();
    formData.append("name", this.typeValidationForm.value.name);
    // formData.append("contact_name", this.typeValidationForm.value.contact_name);
    formData.append("mobile", this.typeValidationForm.value.mobile);
    formData.append("email", this.typeValidationForm.value.email);
    if(this.typeValidationForm.value.password!=""&&this.typeValidationForm.value.password!=null)
    formData.append("password", this.typeValidationForm.value.password);
    let data=this.typeValidationForm.value;
   if(data.user_id==0 || data.user_id==null){
      this.authFackservice.postMultipart('admin/employees',formData).subscribe(
        res => {
          if(res['status']==true){
            this._fetchData();
            Swal.fire('Success!', 'New user has been added.', 'success');
          }else{
            Swal.fire('Error!', res['message'], 'error');
          }
          this.modalService.dismissAll()
        });  
    }else{
      formData.append("user_id", this.typeValidationForm.value.user_id);
      this.authFackservice.putMultipart('admin/employees',formData).subscribe(
        res => {
          if(res['status']==true){
            this._fetchData();
            Swal.fire('Success!', 'Selected user has been updated.', 'success');

          }else{
            Swal.fire('Error!', res['message'], 'error');

          }
          this.modalService.dismissAll()
        }); 
    }
  }

}
