import { collection, onSnapshot, orderBy, query, limit as limitQuery, where as whereQuery, WhereFilterOp } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';

export interface UseCollectionOptions {
  where?: [string, WhereFilterOp, any];
  orderBy?: string;
  limit?: number;
}

export const useCollection = <T,>(path: string, options?: UseCollectionOptions) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to store the serialized options to avoid infinite loops with useEffect dependencies
  const optionsRef = useRef(JSON.stringify(options));
  if (JSON.stringify(options) !== optionsRef.current) {
    optionsRef.current = JSON.stringify(options);
  }

  useEffect(() => {
    setLoading(true);
    try {
      const base = collection(db, path);
      const clauses = [] as any[];

      if (options?.where) {
        // Filter out undefined values to prevent crash
        if (options.where[2] !== undefined) {
          clauses.push(whereQuery(options.where[0], options.where[1], options.where[2]));
        }
      }
      if (options?.orderBy) {
        clauses.push(orderBy(options.orderBy, 'desc'));
      }
      if (options?.limit) {
        clauses.push(limitQuery(options.limit));
      }

      const q = clauses.length ? query(base, ...clauses) : base;

      console.log(`[useCollection] Listening to ${path}`, options);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as T[];
          setData(items);
          setLoading(false);
        },
        (err) => {
          console.error(`[useCollection] Error fetching ${path}:`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error(`[useCollection] Setup error for ${path}:`, err);
      setError(err.message);
      setLoading(false);
      return () => { };
    }
  }, [path, optionsRef.current]);

  return { data, loading, error };
};
