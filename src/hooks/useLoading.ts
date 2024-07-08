import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/index';
import { setLoading } from 'store/loadingSlice';

const useLoadingRedux = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);

    const withLoading = useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
        dispatch(setLoading(true));
        try {
            const result = await promise;
            return result;
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    return { isLoading, withLoading };
};

export default useLoadingRedux;