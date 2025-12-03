



export interface UserObjectFrontend  {
    name: string | null;
    email: string;
    username: string | null;
    id: string;
    createdAt: Date;
    lastLogin: Date | null;
} 

export interface UserObjectWSServer {
    name: string | null;
    email: string;
    username: string | null;
    id: string;
    createdAt: Date;
    lastLogin: Date | null;
}

export type testType = {
    id : string
}