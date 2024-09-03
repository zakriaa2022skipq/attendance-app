import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { updateLoginStatus } from "../features/auth/authSlice";
import { updateUserState } from "../features/user/userSlice";
import axios from "../util/axios";

function PrivateRoute() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();
  const getUserDetail = () =>
    axios
      .get("api/v1/admin/detail", { withCredentials: true })
      .then((response) => response.data);
  const query = useQuery("userDetail", getUserDetail, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    retry: false,
    onSuccess: (data) => {
      dispatch(updateLoginStatus(true));
      dispatch(updateUserState(data.adminDetail));
    },
  });

  if (query.isLoading) {
    return (
      <div
        className="text-[hsl(180, 43%, 41%)] flex items-center justify-center my-4"
        data-testid="loading"
      >
        Loading....
      </div>
    );
  }
  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace state={{ path: location.pathname }} />
  );
}
export default PrivateRoute;
