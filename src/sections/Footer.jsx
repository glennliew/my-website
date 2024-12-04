import React from 'react';

const Footer = () => {
  const handleIconClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <footer className="c-space pt-7 pb-3 border-t border-black-300 flex justify-between items-center flex-wrap gap-5">
      <div className="text-white-500 flex gap-2">
        <p>Terms & Conditions</p>
        <p>|</p>
        <p>Privacy Policy</p>
      </div>

      <div className="flex gap-3">
        <div className="social-icon" onClick={() => handleIconClick('https://github.com/glennliew')}>
          <img src="/assets/github.svg" alt="github" className="w-1/2 h-1/2" />
        </div>
        <div className="social-icon" onClick={() => handleIconClick('https://www.linkedin.com/in/glenn-liew/')}>
          <img src="/assets/linkedin.svg" alt="linkedin" className="w-1/2 h-1/2" />
        </div>
        <div className="social-icon" onClick={() => handleIconClick('https://www.instagram.com/grennnite/')}>
          <img src="/assets/instagram.svg" alt="instagram" className="w-1/2 h-1/2" />
        </div>
      </div>

      <p className="text-white-500">© 2024 Glenn Liew. All rights reserved.</p>
    </footer>
  );
};

export default Footer;