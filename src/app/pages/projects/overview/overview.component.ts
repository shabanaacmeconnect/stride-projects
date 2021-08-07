import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import Swal from 'sweetalert2';
import { overviewBarChart, donutChart, barChart, monthlyEarningChart } from './data';
import { ChartType } from './overview.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

/**
 * Overview component
 */
export class OverviewComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  donutChart: ChartType;
  barChart: ChartType;
  monthlyEarningChart: ChartType;
  overviewBarChart: ChartType;
  responsive?: any;
  legend?: any;
  project:any; tasks:any=[]; users:any=[]
  id=''
  task_id: any;
  task_status: any;
  statuses=[]
  constructor( private route: ActivatedRoute,
    private authFackservice: AuthfakeauthenticationService,private modalService: NgbModal) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Projects', href:'/projects'  }, { label: 'Projects Overview', active: true }];
    this.overviewBarChart = overviewBarChart;
    this.donutChart = donutChart;
    this.barChart = barChart;
    this.monthlyEarningChart = monthlyEarningChart;
    this.id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):'';
    if(this.id){
      this.getDetails()
      this.getTasks()
      this.getUsers()
      this.taskStatusList()
    }
 }
 taskStatusList(){
  this.authFackservice.get('admin/taskStatus').subscribe(
    res => {
      if(res['status']==true){
        this.statuses =res['data'];
      }
    });
 }
  getDetails(){
    this.authFackservice.get('admin/projectDetails?project_id='+this.id).subscribe(
      res => {
        if(res['status']==true){
         this.project=res['data']['projectData'][0];
         this.users=res['data']['teamData'];
         this.tasks=res['data']['tasksData']
        }
    })
  }
  getTasks(){
    // this.authFackservice.get('admin/tasks?project_id='+this.id).subscribe(
    //   res => {
    //     if(res['status']==true){
    //      this.tasks=res['data']
    //     }
    // })
  }
  getUsers(){
    // this.authFackservice.get('admin/projectUsers?project_id='+this.id).subscribe(
    //   res => {
    //     if(res['status']==true){
    //      this.users=res['data']
    //     }
    // })
  }
  editStatus(item,template){
    this.task_id=item.task_id;
    this.task_status=item.task_status;
    this.modalService.open(template, { size: 'sm',windowClass:'modal-holder', centered: true });
  
  }
  onSelect(event){
  this.authFackservice.put('admin/tasks/status?value='+this.task_status+'&project_id='+this.id+'&task_id='+this.task_id,{}).subscribe(
    res => {
      if(res['status']==true){
        this.modalService.dismissAll()
        // Swal.fire('Success!', 'Selected project has been updated.', 'success');
        this.getDetails()
      }else{
        Swal.fire('Error!', res['message'], 'error');
  
      }
    }); 
  
  }
}
