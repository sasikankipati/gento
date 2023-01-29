import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./demo/view/dashboard.component";
import { DashboardAnalyticsComponent } from "./demo/view/dashboardanalytics.component";
import { FormLayoutDemoComponent } from "./demo/view/formlayoutdemo.component";
import { FloatLabelDemoComponent } from "./demo/view/floatlabeldemo.component";
import { InvalidStateDemoComponent } from "./demo/view/invalidstatedemo.component";
import { PanelsDemoComponent } from "./demo/view/panelsdemo.component";
import { OverlaysDemoComponent } from "./demo/view/overlaysdemo.component";
import { MediaDemoComponent } from "./demo/view/mediademo.component";
import { MessagesDemoComponent } from "./demo/view/messagesdemo.component";
import { MiscDemoComponent } from "./demo/view/miscdemo.component";
import { EmptyDemoComponent } from "./demo/view/emptydemo.component";
import { ChartsDemoComponent } from "./demo/view/chartsdemo.component";
import { FileDemoComponent } from "./demo/view/filedemo.component";
import { DocumentationComponent } from "./demo/view/documentation.component";
import { AppMainComponent } from "./app.main.component";
import { AppNotfoundComponent } from "./pages/app.notfound.component";
import { AppErrorComponent } from "./pages/app.error.component";
import { AppAccessdeniedComponent } from "./pages/app.accessdenied.component";
import { AppLoginComponent } from "./pages/app.login.component";
import { InputDemoComponent } from "./demo/view/inputdemo.component";
import { ButtonDemoComponent } from "./demo/view/buttondemo.component";
import { TableDemoComponent } from "./demo/view/tabledemo.component";
import { ListDemoComponent } from "./demo/view/listdemo.component";
import { TreeDemoComponent } from "./demo/view/treedemo.component";
import { IconsComponent } from "./utilities/icons.component";
import { AppCrudComponent } from "./pages/app.crud.component";
import { AppCalendarComponent } from "./pages/app.calendar.component";
import { AppTimelineDemoComponent } from "./pages/app.timelinedemo.component";
import { AppInvoiceComponent } from "./pages/app.invoice.component";
import { AppHelpComponent } from "./pages/app.help.component";
import { BlocksComponent } from "./blocks/blocks/blocks.component";
import { AppWizardComponent } from "./pages/app.wizard.component";
import { AppContactusComponent } from "./pages/app.contactus.component";
import { AppLandingComponent } from "./pages/app.landing.component";
import { ApplicationComponent } from "./sasi/pages/application/application.component";
import { ApplicationDetailComponent } from "./sasi/pages/application-detail/application-detail.component";

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: "",
                    component: AppMainComponent,
                    children: [
                        { path: "", component: ApplicationComponent },
                        {
                            path: "application",
                            component: ApplicationComponent,
                        },
                        {
                            path: "application/:id",
                            component: ApplicationDetailComponent,
                        },
                    ],
                },
                { path: "pages/landing", component: AppLandingComponent },
                { path: "error", component: AppErrorComponent },
                { path: "access", component: AppAccessdeniedComponent },
                { path: "notfound", component: AppNotfoundComponent },
                { path: "login", component: AppLoginComponent },
                { path: "wizard", component: AppWizardComponent },
                { path: "contactus", component: AppContactusComponent },
                { path: "**", redirectTo: "/notfound" },
            ],
            { scrollPositionRestoration: "enabled" }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
