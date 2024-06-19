import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import indexRoutes from "./routes/index.js";
import __dirname from "./dirname.js";
import viewsRoutes from "./routes/views.routes.js";

const app = express();

//PORT
const PORT = 8080;

//App configuracion
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

//Configuracion handlebars
app.engine("hbs", handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
}));

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

//Routes
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use("/", viewsRoutes);
app.use("/api", indexRoutes);

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto http://localhost:${PORT}`);
});

//Confirguracion Socket io
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado", socket.id);
    socket.on("message", (data) => {
        console.log(data);
    });
});
