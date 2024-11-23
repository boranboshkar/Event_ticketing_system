import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./Styles/index.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { BackofficeNavigatorProvider } from "./contexts/BackofficeNavigatorContext.tsx";
import { UserNavigatorProvider } from "./contexts/UserNavigatorContext.tsx";
import { AuthNavigatorProvider } from "./contexts/AuthNavigatorContext.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthNavigatorProvider>
          <UserNavigatorProvider>
            <BackofficeNavigatorProvider>
              <App />
            </BackofficeNavigatorProvider>
          </UserNavigatorProvider>
        </AuthNavigatorProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
