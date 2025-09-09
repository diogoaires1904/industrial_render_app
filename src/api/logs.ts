import { AxiosPromise } from 'axios';
import { APIRequestParams } from '@/contentTypes';
import axios from '@plugins/axios';
import qs from 'qs';

export const API_REF = '/logs';

export async function getLogs(query: APIRequestParams<any>): AxiosPromise<any[]> {
    const params = qs.stringify(query);
    return axios.get(`${API_REF}?${params}`);
}

export async function getLog(id: string, query: APIRequestParams<any>): AxiosPromise<any> {
    const params = qs.stringify(query);
    return axios.get(`${API_REF}/${id}?${params}`);
}

export async function createLog(data: any): AxiosPromise<any> {
    return axios.post(API_REF, { data });
}

export async function updateLog(id: string, data: any): AxiosPromise<any> {
    return axios.put(`${API_REF}/${id}`, { data: data });
}

export async function deleteLog(id: string): AxiosPromise<any> {
    return axios.delete(`${API_REF}/${id}`);
}

export async function deleteLogs(data: any): AxiosPromise<any> {
    return axios.delete(`${API_REF}/many`, {
        params: { ids: data }
    })
}