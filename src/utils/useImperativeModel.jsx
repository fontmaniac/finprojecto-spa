/* FM: Hook for hosting imperative renderers inside declarative React. 
   Preserves native rendering semantics while aligning with React lifecycle. */

import React, { useRef, useEffect } from 'react';

export function useImperativeModel( render, clean, deps=[] ) {
    const nodeRef = useRef(null);

    useEffect(() => {
        render(nodeRef);

        return () => clean(nodeRef);

    }, [...deps]);

    const component = () => {
        return (
            <div
                ref={nodeRef}
                style={{ width: '100%', height: '100%' }}
            />
        );
    };

    return [nodeRef, component];
}


