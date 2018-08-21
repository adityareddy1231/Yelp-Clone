var mongoose = require('mongoose'),
  Place = require('./models/places'),
  Comment = require('./models/comments');

//Seed data
var data = [{
    name: "Mission Dolores Park",
    image: "https://images.unsplash.com/photo-1527484583355-9c200f59f0fd?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=46d42c55e90e52b8409046cc33ce1052&auto=format&fit=crop&w=1350&q=80",
    description: "Mission Dolores Park, often abbreviated to Dolores Park, is a Leave No Trace city park in San Francisco, California. It is located two blocks south of Mission Dolores at the western edge of the Mission District."
  },
  {
    name: "Roche Harbor",
    image: "https://images.unsplash.com/photo-1457473075527-b0db85c08e66?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f7fdf792dd02e710cf9bd35fd672d40b&auto=format&fit=crop&w=1355&q=80",
    description: "Roche Harbor is a sheltered harbor on the northwest side of San Juan Island in San Juan County, Washington, United States, and the site of a resort of the same name. Roche Harbor faces Haro Strait and the Canada–United States border."
  },
  {
    name: "Green Park",
    image: "https://images.unsplash.com/photo-1534317981600-6bb41ad496c7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9fa142debe4a7a8182137ea2bca3f356&auto=format&fit=crop&w=1350&q=80",
    description: "The Green Park, usually known without the article simply as Green Park, is one of the Royal Parks of London. It is located in the City of Westminster, central London. First enclosed in 16th century, it was landscaped in 1820 and is notable among central London parks for having no lakes or buildings, and only minimal flower planting in the form of naturalised narcissus."
  },
  {
    name: "Flaming Gorge Reservoir",
    image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5cedc6b95f731395da7269d2341f9a5e&auto=format&fit=crop&w=1350&q=80",
    description: "Flaming Gorge Reservoir is the largest reservoir in Wyoming, on the Green River, impounded behind the Flaming Gorge Dam. Construction on the dam began in 1958 and was completed in 1964."
  }
];


function seedDB() {

  //Remove all places
  Place.remove({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Removed all places");

      //Add new places
      data.forEach(function(seed) {
        Place.create(seed, function(err, place) {
          if (err) {
            console.log(err);
          } else {
            console.log("Added a campground");

            //Add test comments
            Comment.create({
              text: "This place is awesome! The best I have been too",
              author: "John Doe"
            }, function(err, comment) {
              if (err) {
                console.log(err);
              } else {

                //Add comment reference to places collection and save it
                place.comments.push(comment);
                place.save();
                console.log("Created new comment");
              }
            });
          }
        });
      });
    }
  });

}

module.exports = seedDB;
