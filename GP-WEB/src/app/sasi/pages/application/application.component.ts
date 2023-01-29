import { Component, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { AppBreadcrumbService } from "src/app/app.breadcrumb.service";
import { GentoServiceService } from "../../services/gento-service.service";

@Component({
    selector: "app-application",
    templateUrl: "./application.component.html",
    styleUrls: ["./application.component.scss"],
    providers: [ConfirmationService],
})
export class ApplicationComponent implements OnInit {
    records = [];
    recordDialog = false;
    loading = true;
    record = {
        id: null,
        name : "",
        description : ""
    };
    constructor(
        private breadcrumbService: AppBreadcrumbService,
        private gentoService: GentoServiceService,
        private confirmationService: ConfirmationService
    ) {
        this.breadcrumbService.setItems([
            { label: "Applications" },
            { label: "List", routerLink: ["/application"] },
        ]);
    }

    ngOnInit(): void {
        this.getAllRecords();
    }

    getAllRecords() {
        this.loading = true;
        this.gentoService
            .get("assets/data/applications.json")
            .then((res: any) => {
                console.log(res);
                this.records = res.results;
                this.loading = false;
            })
            .catch((err) => {
                console.log(err);
                this.loading = false;
            });
    }

    openNew() {
        this.record.id = null;
        this.recordDialog = true;
    }

    save(){
        if(this.record.name == ''){

        }else{

        }
    }
    edit(record){
        this.record = record;
        this.recordDialog = true;
    }

    delete(event: Event,record){
        this.confirmationService.confirm({
            target: event.target,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //confirm action
                this.deleteServiceCall(record.id);
            },
            reject: () => {
                //reject action
            }
        });
    }

    deleteServiceCall(id){
        alert("deleted");
    }
}
