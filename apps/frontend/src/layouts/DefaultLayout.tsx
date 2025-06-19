import { PropsWithChildren } from 'react';

const DefaultLayout = ({ children }: PropsWithChildren) => {
    return (
        <div>
            <div className="text-black dark:text-white-dark min-h-screen">{children} </div>
        </div>
    );
};

export default DefaultLayout;
