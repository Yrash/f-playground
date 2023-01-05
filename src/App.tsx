import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { createTheme, Grid, Input, ThemeProvider } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import api from "./api/api";
import { LoadingButton } from "@mui/lab";
import { log } from "console";
import { useForm } from "react-hook-form";

const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: {
            variant: "text",
          },
          style: {
            backgroundColor: "red",
          },
        },
      ],
    },
  },
});

const Form = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    setLoading(true);
    api.user.updateUser(data).then(() => {
      setLoading(false);
    });
  };


  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid xs={4}>
        <Input   {...register("firstName")} />
      </Grid>
      <Grid xs={4}>
        <Input {...register("lastName", { required: true })} />
      </Grid>
      {errors.exampleRequired && <span>This field is required</span>}

      <LoadingButton loading={loading} type="submit">Submit</LoadingButton>
    </form>
  );
};

const HomePage = () => {
  const userData = api.user.useUserCacheOnly();
  return (
    <div>
      <h1>Hello User {userData.data.firstName} {userData.data.lastName}</h1>
      <LoadingButton
        variant="text"
        loading={userData.isLoading || userData.isValidating}
        onClick={() => {
          api.user.logout();
        }}
      >
        Logout
      </LoadingButton>

      <Form />
    </div>
  );
};


const GuestHomePage = () => {
  const userData = api.user.useUserCacheOnly();

  return (
    <div>
      <h1>Hello Guest</h1>
      <LoadingButton
        variant="text"
        loading={userData.isLoading || userData.isValidating}
        onClick={() => {
          api.user.revalidation();
        }}
      >
        Login
      </LoadingButton>
    </div>
  );
};

const privateRoutes = [
  {
    path: "/",
    element: <HomePage/>,
  },
];

const guestRoutes = [
  {
    path: "/",
    element: <GuestHomePage />,
  },
];

function App() {
  const user = api.user.useUser();
  let routes = guestRoutes;


  
  if (user.data?.firstName) {
    
    routes = privateRoutes;
  }
  const router = createBrowserRouter(routes);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
