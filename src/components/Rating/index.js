import React from 'react'
import { pascalCase, generateArray } from '_utils/helpers'

const Rating = props => {
  const countRating = () => {
    const count = props.count || 0
    if (!count) {
      return 'Chưa có'
    }

    if (count >= 50) {
      const times = Math.floor(count / 50)
      return `${times * 50}+`
    }

    return count
  }

  const avg = props.avg || props.value || 0
  const stars = generateArray(avg)
  const hasHalf = avg % 1

  return (
    <div className="comp-rating">
      <div className="stars">
        {stars.map(star => (
          <span key={star} className="full">
            <i className="fas fa-star" />
          </span>
        ))}
        {hasHalf
          ? (
            <span className="half">
              <i className="fas fa-star-half-alt" />
            </span>
          ) : ''}
      </div>

      <span className="number-rating">{countRating()}</span>

      lượt đánh giá từ {pascalCase(props.provider || 'Now')}

      {props.children ? props.children : ''}
    </div>
  )
}

export default Rating
