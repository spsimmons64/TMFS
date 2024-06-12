import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application } from './application';
import { GlobalContextProvider } from './global/contexts/globalcontext';
import { MessageContextProvider } from './administration/contexts/messageContext';
import { ErrorContextProvider } from './global/contexts/errorcontext';
import { UserActionProvider } from './global/contexts/useractioncontext';

import "./assets/css/basecss.css"
import { DriverActionProvider } from './accounts/portal/dashboard/drivers/classes/driveractions';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <MessageContextProvider>
        <GlobalContextProvider>
            <UserActionProvider>
                <ErrorContextProvider>
                    <DriverActionProvider>
                        <Application />
                    </DriverActionProvider >
                </ErrorContextProvider>
            </UserActionProvider>
        </GlobalContextProvider>
    </MessageContextProvider>

);