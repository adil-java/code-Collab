import React from 'react';
import Avatar from 'react-avatar';

export default function Client({ username }) {
  return (
    <div className="relative group w-14 h-14 cursor-pointer">
 
      <Avatar name={username} size="45" round="100%"  />

  
      <div className="absolute top-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {username}
      </div>
    </div>
  );
}

