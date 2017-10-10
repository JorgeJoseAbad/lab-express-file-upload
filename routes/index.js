var express = require('express');
var router = express.Router();
var multer  = require('multer');
const fs = require('fs');


const Picture = require('../models/pictures');

/* GET home page. */
router.get('/', function(req, res, next) {
  Picture.find((err, pictures) => {
    if (err) return next(err);
    res.render('index', {pictures});
  });
});

// Route to upload from project base path
var upload = multer({ dest: './public/uploads/' });

router.post('/upload', upload.single('file'), function(req, res){

  pic = new Picture({
    author: req.body.author,
    name: req.body.name,
    description: req.body.description,
    pic_path: `/uploads/${req.file.filename}`,
    pic_name: req.file.originalname
  });

  pic.save((err) => {
      res.redirect('/');
  });
});


router.get('/:id/edit', function(req, res, next) {
  const id=req.params.id;
  console.log(id);
  Picture.findById(id,(err, picture) => {
    console.log(picture);
    if (err) { return next(err); }
    res.render('edit', {picture:picture});
  });
});

router.post('/:id/edit',function(req,res,next){
  const productId=req.params.id;
  console.log(req.body);
  /*
   * Create a new object with all of the information from the request body.
   * This correlates directly with the schema of Product
   */
  const updates = {
      name: req.body.name,
      author: req.body.author,
      description: req.body.description,
  };
  console.log(updates);

  Picture.findByIdAndUpdate(productId, updates, (err, picture) => {
    console.log(picture);
    if (err){ return next(err); }
    return res.redirect('/');
  });
});

/* to delete file from publics, fs.unlink of node.js*/
router.post('/:id/delete',function(req,res){

    console.log(req.params.id);
    const id = req.params.id;

    Picture.findByIdAndRemove(id, (err, product) => {
      console.log(product);
      console.log(product.pic_path);
      var picToDelete='public'+product.pic_path;
      console.log(picToDelete);
      if (err){
        console.log(err);
        return next(err);
      } else {
        console.log("borrado BBDD, vamos a borrar el fichero");
        fs.unlink(picToDelete, (err) => {
          try{
            if (err) throw err;
            console.log('successfully deleted file: '+picToDelete);
          }
          catch (err){
            console.log(err);
            console.log("No se encuentra este fichero: "+picToDelete);
          }
          finally {
            console.log("he pasado por el unlink");
        }
        });
      }

      return res.redirect('/');
    });

});

module.exports = router;
