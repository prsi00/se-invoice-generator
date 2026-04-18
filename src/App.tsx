import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DefaultLayout } from './components/layout/DefaultLayout'
import { Dashboard } from './pages/Dashboard'
import { Settings } from './pages/Settings'
import { InvoiceEditor } from './pages/InvoiceEditor'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/invoice/new" element={<InvoiceEditor />} />
          <Route path="/invoice/edit/:id" element={<InvoiceEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
