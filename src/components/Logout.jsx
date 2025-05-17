import { useNavigate } from 'react-router-dom';
import React from 'react';

export const useLogout = () => {
  const navigate = useNavigate();
  return () => navigate('/');
};
