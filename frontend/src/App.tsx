import { DashBoard } from "./pages/Dashboard";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShareParams from "./pages/ShareParams";
import { ErrorPage } from "./pages/ErrorPage";
// import { Landing } from "./pages/Landing";
import ImageLinks from "./pages/ImageLinks";
import Test2 from "./pages/Test2";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<Navigate to='/signup'/>}></Route> */}
        <Route path="/" element={<Test2/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/signin" element={<Signin/>}></Route>
        <Route path="/dashboard" element={<DashBoard/>}></Route>
        <Route path="/about" element={<About/>}></Route>
        {/* <Route path="/test" element={<Test/>}></Route> */}
        <Route path="/images" element={<ImageLinks/>}></Route>
        <Route path="/test2" element={<Test2/>}></Route>
        <Route path="/share/:shareLink" element={<ShareParams/>}></Route>
        <Route path="*" element={<ErrorPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;