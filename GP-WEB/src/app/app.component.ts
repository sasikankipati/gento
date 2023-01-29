import { Component, OnInit } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
    topbarTheme = "deeporange";

    menuTheme = "light";

    layoutMode = "light";

    menuMode = "horizontal";

    inlineMenuPosition = "top";

    inputStyle = "outlined";

    ripple = true;

    isRTL = false;

    constructor(private primengConfig: PrimeNGConfig) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
