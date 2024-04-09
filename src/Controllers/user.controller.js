import {User} from "../Models/user.model.js";
import { Review } from "../Models/review.model.js";
import ApiResponse from "../Utils/ApiResponse.js";

const createreview = function (req, res) {
    Review.create({
      user: req.user._id,
      rating: req.body.rating,
      reviews: req.body.reviews,
    });
    res.json(new ApiResponse(200,"Created review successfully!!"));
  };

export {createreview};