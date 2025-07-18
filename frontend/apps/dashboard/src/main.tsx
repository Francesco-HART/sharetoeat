import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { createRouter } from "./routes/routes";
import { createStore } from "@repo/core/create-store";
import { Provider } from "react-redux";
import { FakeAuthGateway } from "@repo/core/auth/adapters/fake-auth.gateway";
import { LocalStorageAuthGateway } from "@repo/core/auth/adapters/local-storage-auth.gateway";
import { Toaster } from "@repo/ui/components/sonner";
import { initApiClient } from "@repo/client-api/client/init-api-client";
import config from "./config";

const authGateway = new FakeAuthGateway();
authGateway.willAuthWithGoogleAs = {
    id: "1234",
    name: "John Doe",
};
const store = createStore({
    authGateway: new LocalStorageAuthGateway(authGateway),
});

initApiClient(config.api.url);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={createRouter()} />
            <Toaster position="top-right" />
        </Provider>
    </StrictMode>,
);
