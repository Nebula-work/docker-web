import { BrowserRouter, Route, Routes } from "react-router-dom"
import Containers from "@/pages/Containers.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import NotFound from "@/pages/NotFound.tsx";
import Layout from "@/components/Layout.tsx";
import { Provider } from 'react-redux';
import {store} from "@/store";
import {useAppInit} from "@/init/useAppInit.ts";

function App() {
useAppInit();
  return (
      <Provider store={store}>
      <BrowserRouter>
          <Layout>
              <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/containers" element={<Containers/>} />
                  <Route path="*" element={<NotFound />} />
              </Routes>
          </Layout>
      </BrowserRouter>
      </Provider>
  )
}

export default App
