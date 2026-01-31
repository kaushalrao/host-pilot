import { db, appId } from '../lib/firebase';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, getDoc, orderBy, getDocs } from 'firebase/firestore';
import { DataService, Repository } from './types';
import { Guest, Property, Template, MaintenanceIssue } from '../lib/types';

const createFirebaseRepository = <T>(collectionName: string): Repository<T> => {
    const getCollectionPath = (userId: string) => `artifacts/${appId}/users/${userId}/${collectionName}`;

    return {
        subscribe: (userId: string, onSuccess: (data: T[]) => void, onError: (error: Error) => void) => {
            const path = getCollectionPath(userId);
            // Default ordering by createdAt desc if applicable, otherwise just fetches
            // You might want to pass sort options later, but generic is fine for now
            let q = query(collection(db, path));

            // Heuristic: If it's the guests collection, we usually sort by createdAt
            if (collectionName === 'guests') {
                q = query(collection(db, path), orderBy('createdAt', 'desc'));
            }

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
                onSuccess(items);
            }, onError);

            return unsubscribe;
        },

        add: async (userId: string, item: Omit<T, 'id'>) => {
            const path = getCollectionPath(userId);
            // Add createdAt if not present? Usually handled by caller or default logic.
            // But let's assume item is fully formed except ID.
            const docRef = await addDoc(collection(db, path), item);
            return docRef.id;
        },

        update: async (userId: string, id: string, data: Partial<T>) => {
            const path = getCollectionPath(userId);
            await updateDoc(doc(db, path, id), data as any);
        },

        delete: async (userId: string, id: string) => {
            const path = getCollectionPath(userId);
            await deleteDoc(doc(db, path, id));
        },

        getOne: async (userId: string, id: string) => {
            const path = getCollectionPath(userId);
            const snap = await getDoc(doc(db, path, id));
            if (snap.exists()) {
                return { id: snap.id, ...snap.data() } as T;
            }
            return undefined;
        },

        getAll: async (userId: string) => {
            const path = getCollectionPath(userId);
            let q = query(collection(db, path));
            if (collectionName === 'guests') {
                q = query(collection(db, path), orderBy('createdAt', 'desc'));
            }
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        }
    };
};

export const firebaseService: DataService = {
    guests: createFirebaseRepository<Guest>('guests'),
    properties: createFirebaseRepository<Property>('properties'),
    templates: createFirebaseRepository<Template>('templates'),
    maintenance: createFirebaseRepository<MaintenanceIssue>('maintenance'),
};
