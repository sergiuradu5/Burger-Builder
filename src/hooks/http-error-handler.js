/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect} from 'react';

export default httpClient => {
    const [error, setError] = useState(null);

        //Even though componentWillMount() is deprecated, we have to is it over componentDidMount()
        //That is mainly because we need to set the interceptors before the WrappedComponent and its children mount
        //Thus, we are making sure that the interceptors are set just in time to intercept the errors in HTTP request / response 
        
            const reqInterceptor = httpClient.interceptors.request.use(req => {
                setError(null);
                return req;
            })
            const  resInterceptor = httpClient.interceptors.response.use(
                res => res, 
                err => {
                    setError(err); 
                    
                })
        //We need componentWillUnmount because when we use the function withErrorHandler with many different pages inside the SPA,
        //... we are actually attaching multiple interceptors to the same httpClient instance
        //The interceptors are leaking memory, occupying unnecessary memory, hence we need to dispose them
        useEffect(()=> {
            return () => {
            httpClient.interceptors.request.eject(reqInterceptor);
            httpClient.interceptors.response.eject(resInterceptor);
            }
        }, [httpClient.interceptors.request, httpClient.interceptors.response, reqInterceptor, resInterceptor]);

        const errorConfirmedHandler = () => {
            setError(null);
        }

        
        return [error, errorConfirmedHandler] ;
}