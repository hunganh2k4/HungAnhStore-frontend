import './App.css'
import Header from './shared/components/Header'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <>
      <Header />
      <div className="pt-[80px]">
        <AppRoutes />
      </div>
    </>
  )
}

export default App
