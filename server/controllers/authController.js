const { User } = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criar novo usuário
    const user = await User.create({
      username,
      email,
      password, // O hook beforeCreate vai gerar o hash
      role
    });

    // Criar e retornar token JWT
    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Criar e retornar token JWT
    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  register,
  login,
  getMe
};