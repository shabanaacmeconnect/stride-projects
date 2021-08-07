import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})

/**
 * Projects-list component
 */
export class ProjectlistComponent implements OnInit {

  projectData:any=[];
  breadCrumbItems: Array<{}>;
  loading=false
 page={totalElements:0,pageNumber:1,size:10};
  statuses=[]
  pro_status=''
  pro_id: any;
 constructor( private authFackservice: AuthfakeauthenticationService,private modalService: NgbModal) { }

 ngOnInit() {
   this.breadCrumbItems = [{ label: 'Projects' }, { label: 'Projects List', active: true }];
  this._fetchData();
  this.proStatusList()
 }
 proStatusList(){
  this.authFackservice.get('admin/projectStatus').subscribe(
    res => {
      if(res['status']==true){
        this.statuses =res['data'];
      }
    });
 }
 public _fetchData() {
  this.authFackservice.get('admin/projects?page='+this.page.pageNumber+'&perPage=10').subscribe(
    res => {
      if(res['status']==true){
        this.projectData.push(...res['data']);
        this.page.totalElements=res['elementCount'];
      }
    });
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
editStatus(item,template){
  this.pro_id=item.project_id;
  this.pro_status=item.project_status;
  this.modalService.open(template, { size: 'sm',windowClass:'modal-holder', centered: true });

}
onSelect(event){
console.log(this.pro_status,this.pro_id)
this.authFackservice.put('admin/projects/status?value='+this.pro_status+'&project_id='+this.pro_id,{}).subscribe(
  res => {
    if(res['status']==true){
      this.modalService.dismissAll();
      this._fetchData()
      // Swal.fire('Success!', 'Selected project has been updated.', 'success');

    }else{
      Swal.fire('Error!', res['message'], 'error');

    }
  }); 

}
}
