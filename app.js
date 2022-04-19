import express from 'express';
import ejs from 'ejs';
import mongoose from 'mongoose';
import { getDay } from './date.js';
import _ from 'lodash';


const app = express();
const { Schema } = mongoose;
const day = getDay();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

// MONGOBD CONNECTION
mongoose.connect('mongodb+srv://gihan-admin:Gamage0212@cluster0.9ooj8.mongodb.net/todolistDB');

// MONGODB SCHEMA
const itemsSchema = new Schema({
  name: String
});

const listSchema = new Schema({
  name: String,
  items: [itemsSchema]
});

// MONGODB MODEL
const Item = mongoose.model("Todo", itemsSchema);

const CustomTodo = mongoose.model("Custom_Todo", listSchema);

// DEFAULT ITEM DOCUMENT
const item1 = new Item({
  name: "Welcome to your Todo!"
});


const itemsArr = [item1];

app.get("/", (req, res) => {
  Item.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      if (items.length == 0) {
        Item.insertMany(itemsArr, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfull.. ");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", {listTitle: day, newListItems: items});
      }
    }
  });
});

app.post("/", (req, res) => {
  const item = req.body.newItem;
  const listName = req.body.list;
  const newItems = new Item({
    name: item
  });
  if (listName === day) {
    newItems.save();
    res.redirect("/");
  } else {
    CustomTodo.findOne({name: listName}, (err, doc) => {
      if (!err) {
        doc.items.push(newItems);
        doc.save();
        console.log(newItems);
        res.redirect("/" + listName);
      }
    })
  }
});

app.post("/delete", (req, res) => {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;
  Item.findByIdAndRemove(checkedItem, (err) => {
    if (!err) {
      if (listName === day) {
        res.redirect("/")
        } else {
          CustomTodo.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItem}}}, (err => {
            if (!err) {
              res.redirect("/" + listName);
            }
          }))
        }
      }
    }
  );
})

app.get("/about", (req, res) =>{
  res.render("about");
});

app.get("/:title", (req, res) => {
  const listTilte = _.capitalize(req.params.title) ;

  CustomTodo.findOne({name: listTilte}, (err, doc) => {
    if (!err) {
      if (!doc) {
        //  CREATE A NEW DOCUMENT
        const todo = new CustomTodo({
          name: listTilte,
          items: itemsArr
        }); 
        todo.save();
        res.redirect("/" + listTilte);

      } else {
        res.render("list", {listTitle: listTilte, newListItems: doc.items});
      }
    }
  })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port || 3000, () => {
  console.log("Server started on port 3000");
});
