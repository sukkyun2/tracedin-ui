import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout.tsx'
import SystemTopology from './pages/SystemTopology/SystemTopology.tsx'
import RealTimeTransaction from './pages/RealTimeTransaction/RealTimeTransaction.tsx'
import TransactionDetail from './pages/TransactionDetail/TransactionDetail.tsx'
import { ReactQueryProvider } from './api/ReactQueryProvider.tsx'
import NotFound from './pages/NotFound/NotFound.tsx'

const App: React.FC = () => {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<MainLayout />}>
            <Route path="toplogy" element={<SystemTopology />} />
            <Route path="transactions" element={<RealTimeTransaction />} />
            <Route path="transactions/:id" element={<TransactionDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactQueryProvider>
  )
}

export default App
