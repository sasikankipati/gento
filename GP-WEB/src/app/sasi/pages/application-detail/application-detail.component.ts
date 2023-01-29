import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import * as _ from "lodash";
import { GentoServiceService } from "../../services/gento-service.service";
declare var LeaderLine: any;

@Component({
    selector: "app-application-detail",
    templateUrl: "./application-detail.component.html",
    styleUrls: ["./application-detail.component.scss"],
    providers: [ConfirmationService],
})
export class ApplicationDetailComponent implements OnInit {
    @ViewChild("startingElement", { read: ElementRef })
    startingElement: ElementRef;
    @ViewChild("endingElement", { read: ElementRef }) endingElement: ElementRef;

    items: MenuItem[];
    applications = [];
    optionNetworks = [];
    networks = [];
    network = {
        name: "",
        from: "",
        to: "",
        color: "#808080",
    };
    blocked: boolean;
    editObj;
    displayNetwork;

    zones = [
        {
            id: null,
            category: "zone",
            icon: "pi pi-stop iconLarge",
            tooltip: "Zone",
            name: "Zone",
            children: [],
            region: null,
            color: "#ffffff",
        },
    ];
    vpcs = [
        {
            id: null,
            category: "vpc",
            icon: "pi pi-sitemap iconLarge",
            tooltip: "VPC",
            name: "VPC",
            children: [],
            cdirRange: null,
            color: "#ffffff"
        },
    ];

    subnets = [
        {
            id: null,
            category: "subnet",
            icon: "pi pi-table iconLarge",
            tooltip: "subnet",
            name: "Subnet",
            children: [],
            cdirRange: null,
            type: null,
            color: "#ffffff",
        },
    ];

    servers = [
        {
            id: null,
            category: "ec2",
            icon: "pi pi-server iconLarge",
            tooltip: "ec2",
            name: "EC2",
            children: [],
            type: "",
            color: "#ffffff",
            cdirRange: null,
        },
        {
            id: null,
            category: "database",
            icon: "pi pi-database iconLarge",
            tooltip: "database",
            name: "Database",
            children: [],
            color: "#ffffff",
            cdirRange: null,
        },
    ];

    lines = [
        {
            id: null,
            category: "network",
            icon: "pi pi-share-alt iconLarge",
            tooltip: "line",
            name: "LINE",
            children: [],
            type: "",
            color: "#ffffff",
        },
    ];

    types = [
        { label: "Public", value: "Public" },
        { label: "Private", value: "Private" },
    ];

    display = false;

    draggedItem: any;

    constructor(
        private confirmationService: ConfirmationService,
        private gentoService: GentoServiceService
    ) {}

    ngAfterContentInit () {
        this.blocked = true;
        setTimeout(() => {
            this.loadline();
        }, 2000);
    }

    ngOnInit(): void {
        this.items = [
            {
                label: "Amazon 1" , icon: "pi pi-download", command: (event) => {
                  this.save()
                }
            },
            { label: "Amazon 2" , icon: "pi pi-download", },
            { label: "Amazon 3" , icon: "pi pi-download", },
            { label: "Amazon 4" , icon: "pi pi-download", },
            { label: "Amazon 5" , icon: "pi pi-download", },
        ];

        this.loadApplication();
    }

    dragStart(item: any) {
        this.draggedItem = item;
    }

    dragEnd() {
        this.draggedItem = null;
    }

    dropZone() {
        this.draggedItem.id = crypto.randomUUID();
        this.draggedItem.children = [];
        this.applications.push({ ...this.draggedItem });
        this.reloadLoadLine();
    }

    dropVPC(app) {
        this.draggedItem.id = crypto.randomUUID();
        this.draggedItem.children = [];
        app.children.push({ ...this.draggedItem });
    }

    dropSubnet(vpc) {
        var subnetNum = vpc.children.length + 1;
        this.draggedItem.id = crypto.randomUUID();
        this.draggedItem.children = [];
        this.draggedItem.name = "Subnet " + subnetNum;
        vpc.children.push({ ...this.draggedItem });
    }

    dropServer(subnet) {
        var serverNum = subnet.children.length + 1;
        this.draggedItem.id = crypto.randomUUID();
        this.draggedItem.children = [];
        this.draggedItem.name = "Server " + serverNum;
        subnet.children.push({ ...this.draggedItem });
    }

    edit(obj) {



        this.editObj = obj;
        this.display = true;
    }

    editNetwork() {
        this.loadOptionNetwork();
        this.displayNetwork = true;
    }

    loadMenus(app) {
        return [
            {
                label: "Edit",
                icon: "pi pi-fw pi-pencil",
                command: (click) => this.edit(""),
            },
            { label: "Delete", icon: "pi pi-fw pi-trash" },
        ];
    }

    delete(items, index) {
        this.confirmationService.confirm({
            message: "Are you sure that you want to perform this action?",
            accept: () => {
                items.splice(index,1);


                if(this.networks.length > 0){
                    this.networks.forEach((n) => {
                        n.draw = false;
                        n.leaderline.remove();
                    });
                }
                this.networks = [];



            },
        });
    }

    checkProp(obj, property) {
        return obj.hasOwnProperty(property);
    }

    loadApplication() {
        this.applications = [
            {
                id: "4b3f6422-0275-4377-87ea-f6e1af07b850",
                category: "zone",
                icon: "pi pi-stop iconLarge",
                tooltip: "Zone",
                name: "Zone",
                children: [
                    {
                        id: "4074fcb1-2768-4286-a159-7885add1d00d",
                        category: "vpc",
                        icon: "pi pi-sitemap iconLarge",
                        tooltip: "VPC",
                        name: "VPC",
                        children: [
                            {
                                id: "f24ddc38-d7ee-4359-a5fd-fd56be81aade",
                                category: "subnet",
                                icon: "pi pi-table  iconLarge",
                                tooltip: "subnet",
                                name: "Subnet 1",
                                children: [
                                    {
                                        id: "c6f6b81f-683c-45c4-abb9-32c68d0c5f39",
                                        category: "ec2",
                                        icon: "pi pi-server iconLarge",
                                        tooltip: "ec2",
                                        name: "s1s1",
                                        children: [],
                                        type: "Public",
                                        color: "#ffffff",
                                        cdirRange: "s1s1",
                                    },
                                    {
                                        id: "35407051-7a6b-4a2d-8ce9-f25a4ffdf3e5",
                                        category: "ec2",
                                        icon: "pi pi-server iconLarge",
                                        tooltip: "ec2",
                                        name: "s1s2",
                                        children: [],
                                        type: "Public",
                                        color: "#ffffff",
                                        cdirRange: "s1s2",
                                    },
                                ],
                                cdirRange: "192.168.129.23/17",
                                type: null,
                                color: "#ffffff",
                            },
                            {
                                id: "34aad861-862f-4a7f-b11f-19ada8d382e6",
                                category: "subnet",
                                icon: "pi pi-table iconLarge",
                                tooltip: "subnet",
                                name: "Subnet 2",
                                children: [
                                    {
                                        id: "958a8bc2-abbb-4d8f-b446-687cd8ede4e5",
                                        category: "ec2",
                                        icon: "pi pi-server iconLarge",
                                        tooltip: "ec2",
                                        name: "s2s1",
                                        children: [],
                                        type: "Public",
                                        color: "#ffffff",
                                        cdirRange: "s2s1",
                                    },
                                    {
                                        id: "56709242-a85b-4c0d-9e42-0e1bcd4a3887",
                                        category: "ec2",
                                        icon: "pi pi-server iconLarge",
                                        tooltip: "ec2",
                                        name: "s2s2",
                                        children: [],
                                        type: "Public",
                                        color: "#ffffff",
                                        cdirRange: "s2s2",
                                    },
                                    {
                                        id: "5d225e33-547c-4c7c-b301-693c124c1d12",
                                        category: "ec2",
                                        icon: "pi pi-server iconLarge",
                                        tooltip: "ec2",
                                        name: "s2s3",
                                        children: [],
                                        type: "Public",
                                        color: "#ffffff",
                                        cdirRange: "s2s3",
                                    },
                                    {
                                        id: "a6ae05b7-af17-4657-a6da-30f53129d4ac",
                                        category: "ec2",
                                        icon: "pi pi-server iconLarge",
                                        tooltip: "ec2",
                                        name: "s2s4",
                                        children: [],
                                        type: "Public",
                                        color: "#ffffff",
                                        cdirRange: "s2s4",
                                    },
                                ],
                                cdirRange: "subnet2Range",
                                type: null,
                                color: "#ffffff",
                            },
                        ],
                        color: "#ffffff",
                    },
                ],
                region: null,
                color: "#ffffff",
            },
        ];

        this.networks = [
            {
                name: "Firewall",
                from: {
                    id: "f24ddc38-d7ee-4359-a5fd-fd56be81aade",
                    name: "Subnet 1",
                    category: "subnet",
                    cdirRange: "192.168.129.23/17",
                    label: "Subnet 1 (subnet1Range)",
                },
                to: {
                    id: "34aad861-862f-4a7f-b11f-19ada8d382e6",
                    name: "Subnet 2",
                    category: "subnet",
                    cdirRange: "192.0.2.0/24",
                    label: "Subnet 2",
                },
                color: "#800080",
            },
        ];

        this.loadOptionNetwork();
    }

    loadOptionNetwork() {
        this.optionNetworks = [];
        this.applications.forEach((zone) => {
            zone.children.forEach((vpc) => {
                vpc.children.forEach((subnet) => {
                    if (subnet.cdirRange) {
                        this.optionNetworks.push({
                            label: `${subnet.name} (${subnet.cdirRange})`,
                            value: {
                                id: subnet.id,
                                name: subnet.name,
                                category: subnet.category,
                                cdirRange: subnet.cdirRange,
                                label: `${subnet.name} (${subnet.cdirRange})`,
                            },
                        });
                    }
                    subnet.children.forEach((server) => {
                        if (server.cdirRange) {
                            this.optionNetworks.push({
                                label: `${server.name} (${server.cdirRange})`,
                                value: {
                                    id: server.id,
                                    name: server.name,
                                    category: server.category,
                                    cdirRange: server.cdirRange,
                                    label: `${server.name} (${server.cdirRange})`,
                                },
                            });
                        }
                    });
                });
            });
        });
    }

    addNetwork() {
        if (this.network.name == "") {
        } else if (this.network.from == "") {
        } else if (this.network.to == "") {
        } else if (this.network.from == this.network.to) {
        } else {
            this.networks.push({
                name: this.network.name,
                from: this.network.from,
                to: this.network.to,
                color: this.network.color,
            });
            this.network = { name: "", from: "", to: "", color: "#333" };
            this.loadline();
        }
    }

    save() {
        var form = {
            "application_name": "applicationd",
            "environment" : "sit",
            "app_team_emailId" : "applicationd@gmail.com",
            "children": [
              {
                "category": "region",
                "name": "greenzone",
                "region" : "ap-southeast-1",
                "children": [
                    {
                      "category": "vpc",
                      "name": "applicationa-VPC",
                      "cidr" : "10.20.0.0/32",
                      "children" : [
                        {
                          "category": "subnet",
                          "name": "Subnet 1",
                          "cidr" : "10.20.5.0/32",
                          "zonenames" : "ap-southeast-1a,ap-southeast-1b,ap-southeast-1c",
                          "type" : "private",
                          "children" : [
                            {
                              "category": "ec2",
                              "name": "s1s1",
                              "ami":"ami-0aa7d40eeae50c9a9",
                              "instance_type":"t1.micro",
                              "min" : "2",
                              "max" : "2",
                              "desired" : "2"
                            },
                            {
                              "category": "ec2",
                              "name": "s1s2",
                              "ami":"ami-0aa7d40eeae50c9a9",
                              "instance_type":"t1.micro",
                              "min" : "2",
                              "max" : "2",
                              "desired" : "2"
                            }
                          ]
                        },
                        {
                          "category": "subnet",
                          "name": "Subnet 2",
                          "cidr" : "10.20.6.0/32",
                          "zonenames" : "ap-southeast-1a,ap-southeast-1b,ap-southeast-1c",
                          "type" : "public",
                          "children" : [
                            {
                              "category": "ec2",
                              "name": "s2s1",
                              "ami":"ami-0aa7d40eeae50c9a9",
                              "instance_type":"t1.micro",
                              "min" : "2",
                              "max" : "2",
                              "desired" : "2"
                            },
                            {
                              "category": "ec2",
                              "name": "s2s2",
                              "ami":"ami-0aa7d40eeae50c9a9",
                              "instance_type":"t1.micro",
                              "min" : "2",
                              "max" : "2",
                              "desired" : "2"
                            }
                          ]
                        }
                      ] 
                    } 
                ]     
              }    
            ]
        };
        
        this.gentoService.downloadFile("/api/gencode", form).then(response => {
            const blob = new Blob([response.body], {
              type: 'application/zip'
            });
            const url = window.URL.createObjectURL(blob);
            //window.open(url);

            // create <a> tag dinamically
            var fileLink = document.createElement('a');
            fileLink.href = url;

            // it forces the name of the downloaded file
            fileLink.download = form.application_name+".zip";

            // triggers the click event
            fileLink.click();

        });
        
    }

    gg = [];

    reloadLoadLine() {
        this.blocked = true;
        this.networks.forEach((n) => {
            n.draw = false;
            n.leaderline.remove();
        });

        setTimeout(() => {
            this.loadline();
        }, 2000);
    }




    loadline() {

        if (this.networks.length > 0) {
            this.networks.forEach((n) => {
                if (n.draw != true) {
                    var x = new LeaderLine(
                        document.getElementById("coord_" + n.from.id),
                        document.getElementById("coord_" + n.to.id),
                        {
                            dash: { animation: true },
                            middleLabel: LeaderLine.pathLabel(n.name),
                            size: 3,
                            color: n.color,
                            path: "arc",
                            hide: false,
                        }
                    );
                    n.leaderline = x;
                    n.draw = true;
                }
            });

        }
        this.blocked = false;
    }

    remove(network, index) {
        network.draw = false;
        network.leaderline.remove();
        this.networks.splice(index, 1);
        this.loadline();
    }

    removeObj(arr,index){

        arr.splice(index,1);
    }


    ngOnDestroy(){
        this.removeLines();
    }

    removeLines(){
        if(this.networks.length > 0){
            this.networks.forEach((n) => {
                n.draw = false;
                n.leaderline.remove();
            });
        }

    }

    tabChange(e){
        if(e.index == 0){
            this.blocked = true;
            setTimeout(() => {
                this.loadline();
            }, 2000);
        }else{
            this.removeLines();
        }
    }


    download(){

    }
}
