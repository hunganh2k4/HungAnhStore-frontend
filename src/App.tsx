import './App.css'
import Header from './shared/components/Header'
import AppRoutes from './routes/AppRoutes'
import Footer from './shared/components/Footer'

function App() {

  return (
    <>
      <Header />
      <div className="pt-[80px]">
        <AppRoutes />
      </div>
      <Footer />
    </>
  )
}

export default App
