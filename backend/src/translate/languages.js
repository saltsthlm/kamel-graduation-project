'use strict';
const getRandomLanguage = () => {
  const languages = ['ro', 'de'];
  return languages[Math.floor(Math.random() * languages.length)];
};

module.exports = {
  getRandomLanguage,
};
