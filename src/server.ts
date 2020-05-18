import { app } from "./app";

app.listen(process.env.PORT, () => {
  console.log(
    `Server is up on PORT: ${process.env.PORT}, URL: ${process.env.URL}`
  );
});
