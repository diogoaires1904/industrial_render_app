import { AxiosPromise } from 'axios';
import { APIRequestParams } from '@/contentTypes';
import axios from '@plugins/axios';
import qs from 'qs';

export const API_REF = '/codes';

export async function getCodes(query: APIRequestParams<any>): AxiosPromise<any[]> {
    const params = qs.stringify(query);
    return axios.get(`${API_REF}?${params}`);
}

export async function getCode(id: string, query: APIRequestParams<any>): AxiosPromise<any> {
    const params = qs.stringify(query);
    return axios.get(`${API_REF}/${id}?${params}`);
}

export async function createCode(data: any): AxiosPromise<any> {
    return axios.post(API_REF, { data });
}

export async function updateCode(id: string, data: any): AxiosPromise<any> {
    return axios.put(`${API_REF}/${id}`, { data: data });
}

export async function deleteCode(id: string): AxiosPromise<any> {
    return axios.delete(`${API_REF}/${id}`);
}

export async function deleteCodes(data: any): AxiosPromise<any> {
    return axios.delete(`${API_REF}/many`, {
        params: { ids: data }
    })
}