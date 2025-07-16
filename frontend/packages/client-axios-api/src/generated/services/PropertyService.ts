/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddPropertyDto } from '../models/AddPropertyDto';
import type { LegalObligation } from '../models/LegalObligation';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PropertyService {
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static getProperty(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Property',
        });
    }
    /**
     * @param requestBody
     * @returns AddPropertyDto Created
     * @throws ApiError
     */
    public static postProperty(
        requestBody?: AddPropertyDto,
    ): CancelablePromise<AddPropertyDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/Property',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns LegalObligation OK
     * @throws ApiError
     */
    public static getProperty1(
        id: string,
    ): CancelablePromise<Array<LegalObligation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/Property/{id}',
            path: {
                'id': id,
            },
        });
    }
}
