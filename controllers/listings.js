const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
      
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
   // console.log("show::",listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={url,filename};
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  }

  module.exports.editListing =  async (req, res) => {
    //console.log(req.params);
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
  }


  // module.exports.updateListing =  async (req, res) => {
  //   let { id } = req.params;
  //   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  //   if(typeof req.file !== "undefined") {
  //     let url = req.file.path;
  //     let filename = req.file.filename; 
  //     listing.image ={url,filename};
  //     console.log("update:",listing.image)
  //     await listing.save();
  //   }   
  //   req.flash("success", "Listing updated");
  //   res.redirect(`/listings/${id}`);
  // }

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // Update the listing with new details
    listing.set(req.body.listing);

    // Check if a new file is uploaded
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}

 


  module.exports.deleteListing =  async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
   // console.log("delete listing",deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  }