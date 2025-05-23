import React from 'react';
import './ActionButton.css';
import { FaArrowRight } from 'react-icons/fa';

export const ActionButton = ({ text, onClick, icon = true }) => {
  return (
    <button className="action-button" onClick={onClick}>
      {text} {icon && <FaArrowRight className="btn-icon" />}
    </button>
  );
};
