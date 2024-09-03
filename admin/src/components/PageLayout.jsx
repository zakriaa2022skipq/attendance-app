import React from "react";
import Sidebar from "./Sidebar";
import Grid from "@mui/material/Grid2";
import { Outlet } from "react-router-dom";

const PageLayout = ({ children }) => {
  return (
    <Grid container spacing={1}>
      <Grid size={4}>
        <Sidebar />
      </Grid>
      <Grid size={8}>
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default PageLayout;
