import { Client, Account } from 'appwrite';
import { environment } from "../environments/environment";

export const client = new Client();

client
    .setEndpoint(environment.API_ENDPOINT)
    .setProject(environment.PROJECT_ID);

export const account = new Account(client);
export const user: any = account.get();
export { ID } from 'appwrite';
