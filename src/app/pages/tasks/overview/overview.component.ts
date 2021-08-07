import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';



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
  
  responsive?: any;
  legend?: any;
  id='';pro_id=''
  task:any;
  comments=[];
  history=[]
  constructor( private route: ActivatedRoute,private authFackservice: AuthfakeauthenticationService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("task_id")?this.route.snapshot.paramMap.get("task_id"):'';
    this.pro_id = this.route.snapshot.paramMap.get("id")?this.route.snapshot.paramMap.get("id"):'';
    setTimeout(()=>{
      this.breadCrumbItems = [{ label: 'Projects', href:'/projects'  },{ label: 'Project Details' , href:'/projects/view/'+this.pro_id },{ label: 'Task Details', active: true }];
      console.log(this.breadCrumbItems)
    },1000)
    if(this.id){
      this.getDetails()
    }
  }
  getDetails(){
    this.authFackservice.get('admin/taskDetails?task_id='+this.id).subscribe(
      res => {
        if(res['status']==true){
          this.task=res['data']['taskData'][0];
          this.comments=res['data']['taskCommentData']
        }
    })
    this.authFackservice.get('admin/tasksHistory?task_id='+this.id+'&project_id='+this.pro_id).subscribe(
      res => {
        if(res['status']==true){
          this.history=res['data'];
        }
    })
  }

}
