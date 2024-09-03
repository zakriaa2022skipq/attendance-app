import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "../src/pages/Home";
import Lesson from "../src/pages/Lesson";
import "./App.css";
import PageLayout from "./components/PageLayout";
import PrivateRoute from "./components/PrivateRoute";
import CheckRecord from "./pages/CheckRecord";
import Landing from "./pages/Landing";
import MarkAttendance from "./pages/MarkAttendance";
import SignIn from "./pages/SignIn";
import Students from "./pages/Students";
import Register from "./pages/Register";
import StudentDetail from "./pages/StudentDetail";

function App() {
  return (
    <>
      <div>
        <Toaster position="top-center" closeButton richColors />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portal" element={<PageLayout />}>
              <Route element={<PrivateRoute />}>
                <Route path="home" element={<Home />} />
                <Route path="markattendance" element={<MarkAttendance />} />
                <Route path="lessons" element={<Lesson />} />
                <Route path="students" element={<Students />} />
                <Route path="checkrecord" element={<CheckRecord />} />
                <Route
                  path="studentdetail/:studentId"
                  element={<StudentDetail />}
                />
              </Route>
            </Route>
          </Routes>
        </LocalizationProvider>
      </div>
    </>
  );
}

export default App;
