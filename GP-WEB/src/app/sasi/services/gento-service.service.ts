import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as _ from "lodash";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class GentoServiceService {
    constructor(private http: HttpClient) {}

    async get(url) {
        return await firstValueFrom(this.http.get(url));
    }

    async post(url, form) {
        return await firstValueFrom(this.http.post(url, form));
    }

    async downloadFile(url, form){
        return await firstValueFrom(this.http.post(url,form, {observe: 'response',responseType: 'blob'}));
    }

    

}
