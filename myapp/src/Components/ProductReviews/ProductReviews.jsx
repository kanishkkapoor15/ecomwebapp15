import React, { useState, useEffect } from 'react';
import axios from 'axios';
import'./ProductReviews.css'

const ProductReviews = (props) => {
    const{product} = props;
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

      // Function to fetch product reviews
  const fetchReviews = async () => {
    try {
       // Retrieve auth token from localStorage
      const response = await axios.get(`http://localhost:4000/api/products/${product._id}/reviews`, {
        headers: {
            'auth-token' : `${localStorage.getItem('auth-token')}`, // Include auth token in request headers
        },
      });
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error fetching reviews');
    }
  };

  // Fetch product reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [product._id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
     // Retrieve auth token from localStorage
      const response = await axios.post(`http://localhost:4000/api/products/${product._id}/reviews`, {
        rating,
        comment,
      }, {
        headers: {
            'auth-token' : `${localStorage.getItem('auth-token')}`, // Include auth token in request headers
        },
      });
      console.log('Review added:', response.data);
      // Fetch updated reviews after adding a new review
      await fetchReviews();
      // Reset form fields
      setRating('');
      setComment('');
    } catch (error) {
      console.error('Error adding review:', error);
      setError('Error adding review');
    }

    setIsLoading(false);
  };
  

  return (
    <div>
      <h2>Product Reviews</h2>
      {error && <p>{error}</p>}
      <ul>
        {reviews.map((review) => (
          <li key={review._id}>
            <p>User: {review.name}</p>
            <p>Rating: {review.rating}</p>
            <p>Comment: {review.comment}</p>
          </li>
        ))}
      </ul>
      <h3>Add a Review</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="comment">Comment:</label>
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
);
}


export default ProductReviews
