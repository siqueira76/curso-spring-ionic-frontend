import { HttpClient } from "@angular/common/http";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { API_CONFIG } from "../config/api.config";
import { Injectable } from "@angular/core";

@Injectable()
export class Authservice {

    constructor(public http: HttpClient) {
    }

    authenticate(credis: CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`,
            credis,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }

}