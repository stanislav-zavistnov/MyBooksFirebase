import firebase from 'firebase/compat/app';
import { User as FirebaseUser } from 'firebase/auth';

export type AuthUser = firebase.User | FirebaseUser | null;

export interface DataItem {
    id: string;
    text: string;
    createdAt: Date;
}