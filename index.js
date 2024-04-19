import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo_list",
  password: "sarb1928",
  port: 5432,
}); 
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];


app.get("/", async (req, res) => {
  items = [];
  const select = await db.query("SELECT * FROM list");
  select.rows.forEach(element => {
    const list ={
    id : element.id,
    title : element.title
    }
    items.push(list);
  });
  // console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  db.query("INSERT INTO list (title) VALUES ($1)",[
    item
  ])
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  console.log(id,title);
  db.query("UPDATE list SET title = $1 WHERE id=$2",[
    title,id
  ])
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const id = req.body.deleteItemId;
  db.query("DELETE FROM list WHERE id=$1",[
    id
  ])
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
