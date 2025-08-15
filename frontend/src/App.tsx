import { BrowserRouter, Route, Routes } from "react-router-dom"
import Containers from "@/pages/Containers.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import NotFound from "@/pages/NotFound.tsx";
import Layout from "@/components/Layout.tsx";

function App() {

  return (
      <BrowserRouter>
          <Layout>
              <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/containers" element={<Containers/>} />
                  <Route path="*" element={<NotFound />} />
              </Routes>
          </Layout>
      </BrowserRouter>
  )
}

export default App
