import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
    const socket = useRef();

    useEffect(() => {
        socket.current = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    return socket.current;
};