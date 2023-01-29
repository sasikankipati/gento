import { Component, OnInit } from "@angular/core";
import { AppComponent } from "./app.component";

@Component({
    selector: "app-menu",
    template: `
        <ul class="layout-menu">
            <li
                app-menuitem
                *ngFor="let item of model; let i = index"
                [item]="item"
                [index]="i"
                [root]="true"
            ></li>
        </ul>
    `,
})
export class AppMenuComponent implements OnInit {
    model: any[];

    constructor(public app: AppComponent) {}

    ngOnInit() {
        this.model = [
            {
                label: "GENTO",
                icon: "pi pi-fw pi-home",
                items: [
                    {
                        label: "Applications",
                        icon: "pi pi-fw pi-table",
                        routerLink: ["/application"],
                    },
                ],
            },
        ];
    }
}
