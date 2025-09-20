const addSweet = async (req, res) => {
  return res.status(201).json({ message: 'Sweet created' });
};

module.exports = { addSweet };
