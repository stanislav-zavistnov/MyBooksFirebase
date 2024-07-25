import firebase from 'firebase/compat/app';
import { User as FirebaseUser } from 'firebase/auth';

export type AuthUser = firebase.User | FirebaseUser | null;

export interface DataItem {
    id: string;
    bookName: string;
    createdAt: string;
    bookLength: string;
    author: string;
    comment: string;
    status: 'inProcess' | 'finished' | 'fireplace';
    rating: string;
    dailyResult: Array<dailyResultItem>;
}

interface dailyResultItem {
    started: string;
    currentPage: string;
}