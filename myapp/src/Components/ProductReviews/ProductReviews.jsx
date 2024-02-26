import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ProductReviews.css';
import grey_user from '../Assets/greyUser.png';
import { useNavigate } from 'react-router-dom';

const ProductReviews = (props) => {
  const navigate = useNavigate();
  const { product } = props;
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0); // Initialize rating state to 0
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReviews, setShowReviews] = useState(true); // State to manage visibility of reviews
  const [showPostBox, setShowPostBox] = useState(false); // State to manage visibility of post box
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup

  // Function to fetch product reviews
  const fetchReviews = useCallback(async () => {
    try {
      if (product && product._id) {
        const response = await axios.get(`http://localhost:4000/api/products/${product._id}/reviews`, {
          headers: {
            'auth-token': `${localStorage.getItem('auth-token')}`, // Include auth token in request headers
          },
        });
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error fetching reviews');
    }
  }, [product]);

  // Fetch product reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (product && product._id) {
        const response = await axios.post(`http://localhost:4000/api/products/${product._id}/reviews`, {
          rating,
          comment,
        }, {
          headers: {
            'auth-token': `${localStorage.getItem('auth-token')}`, // Include auth token in request headers
          },
        });
        console.log('Review added:', response.data);
        await fetchReviews();
        setRating(0); // Reset rating after submission
        setComment('');
        setShowPopup(true);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      setError('Error adding review');
    }

    setIsLoading(false);
  };

  // Function to handle toggling between reviews and post box
  const toggleReviews = () => {
    setShowReviews(true);
    setShowPostBox(false);
  };

  const togglePostBox = () => {
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      setShowReviews(false);
      setShowPostBox(true);
    } else {
      navigate('/login');
    }
  };

  // Function to handle the "Continue" button click event
  // const handleContinue = () => {
  //   setShowPopup(false);
  //   window.location.reload();
  // };

  // Function to handle rating change
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className='ProductReviews'>
      <div className="product-reviews-box-navigator">
        <div className={`product-reviews-nav-box ${showReviews ? 'active' : ''}`} onClick={toggleReviews}>Reviews</div>
        <div className={`product-reviews-nav-post-box ${showPostBox ? 'active' : ''}`} onClick={togglePostBox}>Tell us your experience</div>
      </div>
      {error && <p>{error}</p>}
      <div className="product-reviews-box">
        <div>
          {reviews.map((review) => (
            <li key={review._id}>
              <p className='product-reviews-username'><img src={grey_user} alt="" /> <b>{review.name}</b></p>
              <p><b>Rating :</b>  {review.rating}/5</p>
              <p><b>Comment :</b>  {review.comment}</p>
              <hr />
              <br />
            </li>
          ))}
        </div>
      </div>
      {showPostBox && (
        <div className="product-reviews-post-box">
          <form onSubmit={handleSubmit}>
            <div className='product-reviews-post-box-rating'>
              <label htmlFor="rating">Rating(<i>Rate us out of five</i>)</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? 'filled' : ''}
                    onClick={() => handleRatingChange(star)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
            <div className='product-reviews-post-box-comment'>
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding Review...' : 'Add Review'}
            </button>
          </form>
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Thank you! We appreciate your feedback.</p>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
