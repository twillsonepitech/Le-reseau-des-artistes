import { User } from './user';

export interface Feed  {
    id: number;
    content: string;
    liked:0 | 1 ;
    likes: number;
    userId: number;
    created_at:string;
    name:string;
    saved:0 | 1 ;
    has_file:boolean;
}



export interface LikedMarks  {
    id: number;
    content: string;
    user_id: number;
    created_at:string;
    name:string;
    post_id:number;
    has_file:boolean;
}